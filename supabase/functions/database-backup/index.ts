import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FTPSettings {
  ftp_host: string;
  ftp_username: string;
  ftp_password: string;
  ftp_port: number;
  backup_enabled: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting database backup process...');

    // Get FTP settings
    const { data: ftpSettings, error: ftpError } = await supabase
      .from('ftp_settings')
      .select('*')
      .single();

    if (ftpError || !ftpSettings) {
      console.error('Error fetching FTP settings:', ftpError);
      throw new Error('Failed to fetch FTP settings');
    }

    if (!ftpSettings.backup_enabled) {
      console.log('Backups are disabled');
      return new Response(
        JSON.stringify({ message: 'Backups are disabled' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('FTP settings retrieved, exporting database...');

    // Export all tables
    const tables = [
      'blog_posts',
      'categories',
      'certifications',
      'contact_info',
      'contact_submissions',
      'content_sections',
      'profiles',
      'seo_metadata',
      'site_settings',
      'skills_entries',
      'social_links',
      'stats_entries',
      'work_experiences',
      'ftp_settings'
    ];

    const backupData: Record<string, any> = {};

    for (const table of tables) {
      console.log(`Exporting table: ${table}`);
      const { data, error } = await supabase.from(table).select('*');
      
      if (error) {
        console.error(`Error exporting ${table}:`, error);
        continue;
      }
      
      backupData[table] = data;
    }

    // Create backup file content
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const backupContent = JSON.stringify(backupData, null, 2);
    const fileName = `database-backup-${timestamp}.json`;

    console.log(`Backup file created: ${fileName}, size: ${backupContent.length} bytes`);

    // Upload to FTP
    try {
      console.log(`Connecting to FTP: ${ftpSettings.ftp_host}:${ftpSettings.ftp_port}`);
      
      // Using Deno's TCP connection for FTP
      const conn = await Deno.connect({
        hostname: ftpSettings.ftp_host,
        port: ftpSettings.ftp_port,
      });

      const encoder = new TextEncoder();
      const decoder = new TextDecoder();

      // Read welcome message
      const welcomeBuffer = new Uint8Array(1024);
      await conn.read(welcomeBuffer);
      console.log('FTP connected:', decoder.decode(welcomeBuffer));

      // Send USER command
      await conn.write(encoder.encode(`USER ${ftpSettings.ftp_username}\r\n`));
      const userBuffer = new Uint8Array(1024);
      await conn.read(userBuffer);
      console.log('USER response:', decoder.decode(userBuffer));

      // Send PASS command
      await conn.write(encoder.encode(`PASS ${ftpSettings.ftp_password}\r\n`));
      const passBuffer = new Uint8Array(1024);
      await conn.read(passBuffer);
      console.log('PASS response:', decoder.decode(passBuffer));

      // Switch to passive mode
      await conn.write(encoder.encode('PASV\r\n'));
      const pasvBuffer = new Uint8Array(1024);
      const pasvLen = await conn.read(pasvBuffer);
      const pasvResponse = decoder.decode(pasvBuffer.subarray(0, pasvLen || 0));
      console.log('PASV response:', pasvResponse);

      // Parse PASV response to get data connection details
      const pasvMatch = pasvResponse.match(/\((\d+),(\d+),(\d+),(\d+),(\d+),(\d+)\)/);
      if (!pasvMatch) {
        throw new Error('Failed to parse PASV response');
      }

      const dataHost = `${pasvMatch[1]}.${pasvMatch[2]}.${pasvMatch[3]}.${pasvMatch[4]}`;
      const dataPort = parseInt(pasvMatch[5]) * 256 + parseInt(pasvMatch[6]);
      console.log(`Data connection: ${dataHost}:${dataPort}`);

      // Open data connection
      const dataConn = await Deno.connect({
        hostname: dataHost,
        port: dataPort,
      });

      // Send STOR command
      await conn.write(encoder.encode(`STOR ${fileName}\r\n`));
      const storBuffer = new Uint8Array(1024);
      await conn.read(storBuffer);
      console.log('STOR response:', decoder.decode(storBuffer));

      // Send backup data
      await dataConn.write(encoder.encode(backupContent));
      dataConn.close();

      // Read completion response
      const completeBuffer = new Uint8Array(1024);
      await conn.read(completeBuffer);
      console.log('Transfer complete:', decoder.decode(completeBuffer));

      // Send QUIT command
      await conn.write(encoder.encode('QUIT\r\n'));
      conn.close();

      console.log('FTP upload completed successfully');
    } catch (ftpError) {
      console.error('FTP upload error:', ftpError);
      throw new Error(`FTP upload failed: ${ftpError.message}`);
    }

    // Update last backup timestamp
    const { error: updateError } = await supabase
      .from('ftp_settings')
      .update({ last_backup_at: new Date().toISOString() })
      .eq('id', ftpSettings.id);

    if (updateError) {
      console.error('Error updating last backup timestamp:', updateError);
    }

    console.log('Backup completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Database backup completed successfully',
        fileName 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Backup error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
