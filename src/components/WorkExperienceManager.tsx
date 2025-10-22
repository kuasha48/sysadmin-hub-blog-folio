import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, Edit, Trash2, Plus, X } from 'lucide-react';
import { useWorkExperiences } from '@/hooks/useContent';

interface WorkExperience {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
  achievements: string[];
  sort_order: number;
}

const WorkExperienceManager = () => {
  const { workExperiences, loading, refetch } = useWorkExperiences();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Partial<WorkExperience>>({});
  const [addingNew, setAddingNew] = useState(false);
  const [newExperience, setNewExperience] = useState<Partial<WorkExperience>>({
    title: '',
    company: '',
    period: '',
    description: '',
    achievements: [''],
    sort_order: workExperiences.length + 1
  });
  const { toast } = useToast();

  const handleEdit = (exp: WorkExperience) => {
    setEditingId(exp.id);
    setEditingData({ ...exp });
  };

  const handleSave = async (id: string) => {
    // Exclude id from update - only send the fields that should be updated
    const { id: _, ...updateData } = editingData as WorkExperience;
    
    const { error } = await supabase
      .from('work_experiences')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Update error:', error);
      toast({
        title: "Error",
        description: "Failed to update work experience",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Work experience updated successfully!",
      });
      setEditingId(null);
      setEditingData({});
      refetch();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this work experience?')) return;

    const { error } = await supabase
      .from('work_experiences')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete work experience",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Work experience deleted successfully!",
      });
      refetch();
    }
  };

  const handleAddNew = async () => {
    if (!newExperience.title || !newExperience.company || !newExperience.period) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('work_experiences')
      .insert({
        title: newExperience.title,
        company: newExperience.company,
        period: newExperience.period,
        description: newExperience.description || '',
        achievements: newExperience.achievements?.filter(a => a.trim()) || [],
        sort_order: newExperience.sort_order || workExperiences.length + 1
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add work experience",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Work experience added successfully!",
      });
      setAddingNew(false);
      setNewExperience({
        title: '',
        company: '',
        period: '',
        description: '',
        achievements: [''],
        sort_order: workExperiences.length + 2
      });
      refetch();
    }
  };

  const updateAchievement = (index: number, value: string, isEditing: boolean) => {
    if (isEditing && editingData.achievements) {
      const newAchievements = [...editingData.achievements];
      newAchievements[index] = value;
      setEditingData({ ...editingData, achievements: newAchievements });
    } else if (newExperience.achievements) {
      const newAchievements = [...newExperience.achievements];
      newAchievements[index] = value;
      setNewExperience({ ...newExperience, achievements: newAchievements });
    }
  };

  const addAchievement = (isEditing: boolean) => {
    if (isEditing && editingData.achievements) {
      setEditingData({ ...editingData, achievements: [...editingData.achievements, ''] });
    } else if (newExperience.achievements) {
      setNewExperience({ ...newExperience, achievements: [...newExperience.achievements, ''] });
    }
  };

  const removeAchievement = (index: number, isEditing: boolean) => {
    if (isEditing && editingData.achievements) {
      const newAchievements = editingData.achievements.filter((_, i) => i !== index);
      setEditingData({ ...editingData, achievements: newAchievements });
    } else if (newExperience.achievements) {
      const newAchievements = newExperience.achievements.filter((_, i) => i !== index);
      setNewExperience({ ...newExperience, achievements: newAchievements });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Work Experience</CardTitle>
            <CardDescription>Manage work experience entries displayed on the About page</CardDescription>
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
              <h3 className="font-semibold mb-4">Add New Work Experience</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Job Title *</Label>
                    <Input
                      value={newExperience.title}
                      onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
                      placeholder="System Administrator"
                    />
                  </div>
                  <div>
                    <Label>Period *</Label>
                    <Input
                      value={newExperience.period}
                      onChange={(e) => setNewExperience({ ...newExperience, period: e.target.value })}
                      placeholder="Jan 2020 - Present"
                    />
                  </div>
                </div>
                <div>
                  <Label>Company *</Label>
                  <Input
                    value={newExperience.company}
                    onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                    placeholder="Company Name - Location"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={newExperience.description}
                    onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                    placeholder="Brief job description"
                  />
                </div>
                <div>
                  <Label>Achievements</Label>
                  {newExperience.achievements?.map((achievement, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={achievement}
                        onChange={(e) => updateAchievement(index, e.target.value, false)}
                        placeholder="Achievement or responsibility"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAchievement(index, false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => addAchievement(false)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Achievement
                  </Button>
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

          {/* Existing Experiences */}
          {loading ? (
            <div>Loading...</div>
          ) : (
            workExperiences.map((exp) => (
              <div key={exp.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{exp.title}</h3>
                    <p className="text-sm text-muted-foreground">{exp.company}</p>
                    <p className="text-sm text-muted-foreground">{exp.period}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(exp)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(exp.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {editingId === exp.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Job Title</Label>
                        <Input
                          value={editingData.title}
                          onChange={(e) => setEditingData({ ...editingData, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Period</Label>
                        <Input
                          value={editingData.period}
                          onChange={(e) => setEditingData({ ...editingData, period: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Company</Label>
                      <Input
                        value={editingData.company}
                        onChange={(e) => setEditingData({ ...editingData, company: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={editingData.description}
                        onChange={(e) => setEditingData({ ...editingData, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Achievements</Label>
                      {editingData.achievements?.map((achievement, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <Input
                            value={achievement}
                            onChange={(e) => updateAchievement(index, e.target.value, true)}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeAchievement(index, true)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={() => addAchievement(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Achievement
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleSave(exp.id)}>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm mb-2">{exp.description}</p>
                    <ul className="text-sm space-y-1">
                      {exp.achievements.map((achievement, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkExperienceManager;
