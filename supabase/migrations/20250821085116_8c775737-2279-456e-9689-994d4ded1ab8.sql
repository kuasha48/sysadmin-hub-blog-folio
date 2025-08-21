-- Update the tawk_widget_code with the new value provided by user
UPDATE site_settings 
SET setting_value = '<!--Start of Tawk.to Script-->
<script type="text/javascript">
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src=''https://embed.tawk.to/63848a12daff0e1306d9cb28/1j35ss5nt'';
s1.charset=''UTF-8'';
s1.setAttribute(''crossorigin'',''*'');
s0.parentNode.insertBefore(s1,s0);
})();
</script>
<!--End of Tawk.to Script-->'
WHERE setting_key = 'tawk_widget_code';