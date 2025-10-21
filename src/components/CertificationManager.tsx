import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, Edit, Trash2, Plus } from 'lucide-react';
import { useCertifications } from '@/hooks/useContent';

interface Certification {
  id: string;
  name: string;
  issuer: string | null;
  issue_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  sort_order: number;
}

const CertificationManager = () => {
  const { certifications, loading, refetch } = useCertifications();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Partial<Certification>>({});
  const [addingNew, setAddingNew] = useState(false);
  const [newCertification, setNewCertification] = useState<Partial<Certification>>({
    name: '',
    issuer: '',
    issue_date: '',
    credential_id: '',
    credential_url: '',
    sort_order: certifications.length + 1
  });
  const { toast } = useToast();

  const handleEdit = (cert: Certification) => {
    setEditingId(cert.id);
    setEditingData({ ...cert });
  };

  const handleSave = async (id: string) => {
    const { error } = await supabase
      .from('certifications')
      .update(editingData)
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update certification",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Certification updated successfully!",
      });
      setEditingId(null);
      setEditingData({});
      refetch();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certification?')) return;

    const { error } = await supabase
      .from('certifications')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete certification",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Certification deleted successfully!",
      });
      refetch();
    }
  };

  const handleAddNew = async () => {
    if (!newCertification.name) {
      toast({
        title: "Error",
        description: "Please enter a certification name",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('certifications')
      .insert({
        name: newCertification.name,
        issuer: newCertification.issuer || null,
        issue_date: newCertification.issue_date || null,
        credential_id: newCertification.credential_id || null,
        credential_url: newCertification.credential_url || null,
        sort_order: newCertification.sort_order || certifications.length + 1
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add certification",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Certification added successfully!",
      });
      setAddingNew(false);
      setNewCertification({
        name: '',
        issuer: '',
        issue_date: '',
        credential_id: '',
        credential_url: '',
        sort_order: certifications.length + 2
      });
      refetch();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Certifications</CardTitle>
            <CardDescription>Manage certifications displayed on the About page</CardDescription>
          </div>
          <Button onClick={() => setAddingNew(true)} disabled={addingNew}>
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Add New Form */}
          {addingNew && (
            <div className="border rounded-lg p-4 bg-muted">
              <h3 className="font-semibold mb-4">Add New Certification</h3>
              <div className="space-y-4">
                <div>
                  <Label>Certification Name *</Label>
                  <Input
                    value={newCertification.name}
                    onChange={(e) => setNewCertification({ ...newCertification, name: e.target.value })}
                    placeholder="AWS Certified Solutions Architect"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Issuer</Label>
                    <Input
                      value={newCertification.issuer || ''}
                      onChange={(e) => setNewCertification({ ...newCertification, issuer: e.target.value })}
                      placeholder="Amazon Web Services"
                    />
                  </div>
                  <div>
                    <Label>Issue Date</Label>
                    <Input
                      value={newCertification.issue_date || ''}
                      onChange={(e) => setNewCertification({ ...newCertification, issue_date: e.target.value })}
                      placeholder="Jan 2023"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Credential ID</Label>
                    <Input
                      value={newCertification.credential_id || ''}
                      onChange={(e) => setNewCertification({ ...newCertification, credential_id: e.target.value })}
                      placeholder="ABC123DEF456"
                    />
                  </div>
                  <div>
                    <Label>Credential URL</Label>
                    <Input
                      value={newCertification.credential_url || ''}
                      onChange={(e) => setNewCertification({ ...newCertification, credential_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddNew}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => setAddingNew(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Existing Certifications */}
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certifications.map((cert) => (
                <div key={cert.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold">{cert.name}</h3>
                      {cert.issuer && <p className="text-sm text-muted-foreground">{cert.issuer}</p>}
                      {cert.issue_date && <p className="text-xs text-muted-foreground">{cert.issue_date}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(cert)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(cert.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {editingId === cert.id ? (
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label>Certification Name</Label>
                        <Input
                          value={editingData.name}
                          onChange={(e) => setEditingData({ ...editingData, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Issuer</Label>
                        <Input
                          value={editingData.issuer || ''}
                          onChange={(e) => setEditingData({ ...editingData, issuer: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Issue Date</Label>
                        <Input
                          value={editingData.issue_date || ''}
                          onChange={(e) => setEditingData({ ...editingData, issue_date: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Credential ID</Label>
                        <Input
                          value={editingData.credential_id || ''}
                          onChange={(e) => setEditingData({ ...editingData, credential_id: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Credential URL</Label>
                        <Input
                          value={editingData.credential_url || ''}
                          onChange={(e) => setEditingData({ ...editingData, credential_url: e.target.value })}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleSave(cert.id)}>
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {cert.credential_id && (
                        <p className="text-xs text-muted-foreground mt-2">ID: {cert.credential_id}</p>
                      )}
                      {cert.credential_url && (
                        <a
                          href={cert.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline"
                        >
                          View Credential
                        </a>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificationManager;
