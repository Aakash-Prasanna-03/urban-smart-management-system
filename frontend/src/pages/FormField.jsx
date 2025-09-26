import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
// import { FormField } from './FormField';
import { 
  User, 
  Mail, 
  Lock, 
  Save, 
  Camera, 
  Calendar,
  Clock,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Settings,
  Bell,
  Globe,
  Eye,
  LogOut
} from 'lucide-react';

export default function Profile() {
  const { user, updateProfile, logout, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isDirty, setIsDirty] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.newPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required to change password';
      }
      if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'New password must be at least 6 characters';
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!validateForm()) {
      return;
    }

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.newPassword) {
        updateData.password = formData.newPassword;
      }

      await updateProfile(updateData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      setIsDirty(false);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to update profile' 
      });
    }
  };

  const handleReset = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setErrors({});
    setIsDirty(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'preferences', label: 'Preferences', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Enhanced Profile Header */}
        <div className="relative mb-8">
          <div className="bg-white rounded-3xl shadow-xl border border-white/20 overflow-hidden backdrop-blur-sm">
            {/* Cover Image with Gradient */}
            <div className="relative h-48 bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute top-6 right-6">
                <button 
                  onClick={logout}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2.5 rounded-xl transition-all duration-200 hover:scale-105"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="px-8 pb-8">
              <div className="flex flex-col lg:flex-row lg:items-end -mt-20 mb-8">
                {/* Avatar Section */}
                <div className="relative mb-6 lg:mb-0">
                  <div className="relative">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-32 h-32 rounded-2xl border-4 border-white shadow-2xl"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl border-4 border-white shadow-2xl flex items-center justify-center">
                        <span className="text-3xl font-bold text-white">{getInitials(user.name)}</span>
                      </div>
                    )}
                    <button className="absolute -bottom-2 -right-2 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl shadow-lg transition-all duration-200 hover:scale-105">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* User Info */}
                <div className="lg:ml-8 lg:pb-4">
                  <h1 className="text-4xl font-bold text-slate-900 mb-2">{user.name}</h1>
                  <p className="text-slate-600 text-lg mb-4">{user.email}</p>
                  <div className="flex flex-wrap gap-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      Active
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Shield className="w-3 h-3 mr-2" />
                      Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Enhanced Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl border border-blue-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Member Since</p>
                      <p className="text-lg font-bold text-slate-900">{formatDate(user.joinedAt || new Date())}</p>
                    </div>
                  </div>
                </div>

                <div className="group bg-gradient-to-br from-emerald-50 to-green-100 p-6 rounded-2xl border border-emerald-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-emerald-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Last Login</p>
                      <p className="text-lg font-bold text-slate-900">Today</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Main Content */}
        <div className="bg-white rounded-3xl shadow-xl border border-white/20 overflow-hidden backdrop-blur-sm">
          {/* Modern Tabs */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200/60">
            <nav className="flex space-x-1 px-8 py-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white text-indigo-600 shadow-md border border-indigo-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {message && (
              <div className={`mb-8 p-4 rounded-2xl border-l-4 flex items-center space-x-3 ${
                message.type === 'success' 
                  ? 'bg-green-50 border-l-green-500 border border-green-200' 
                  : 'bg-red-50 border-l-red-500 border border-red-200'
              }`}>
                <div className={`p-1 rounded-lg ${
                  message.type === 'success' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {message.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <span className={`font-medium ${
                  message.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {message.text}
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <User className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900">Personal Information</h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <FormField
                      label="Full Name"
                      icon={<User className="w-4 h-4" />}
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      error={errors.name}
                      className="text-lg"
                    />

                    <FormField
                      label="Email Address"
                      type="email"
                      icon={<Mail className="w-4 h-4" />}
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      error={errors.email}
                      className="text-lg"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Shield className="w-5 h-5 text-red-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900">Password & Security</h3>
                  </div>

                  <div className="space-y-6">
                    <FormField
                      label="Current Password"
                      type="password"
                      icon={<Lock className="w-4 h-4" />}
                      placeholder="Enter your current password"
                      description="Required to change your password"
                      value={formData.currentPassword}
                      onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                      error={errors.currentPassword}
                    />

                    <FormField
                      label="New Password"
                      type="password"
                      icon={<Lock className="w-4 h-4" />}
                      placeholder="Enter new password"
                      description="Must be at least 6 characters long"
                      value={formData.newPassword}
                      onChange={(e) => handleInputChange('newPassword', e.target.value)}
                      error={errors.newPassword}
                    />

                    {formData.newPassword && (
                      <FormField
                        label="Confirm New Password"
                        type="password"
                        icon={<Lock className="w-4 h-4" />}
                        placeholder="Confirm new password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        error={errors.confirmPassword}
                      />
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="space-y-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Settings className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900">Account Preferences</h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center space-x-3">
                          <Bell className="w-5 h-5 text-slate-600" />
                          <div>
                            <p className="font-medium text-slate-900">Email Notifications</p>
                            <p className="text-sm text-slate-600">Receive updates via email</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center space-x-3">
                          <Globe className="w-5 h-5 text-slate-600" />
                          <div>
                            <p className="font-medium text-slate-900">Public Profile</p>
                            <p className="text-sm text-slate-600">Make profile visible to others</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Form Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-slate-200 space-y-3 sm:space-y-0">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={!isDirty || loading}
                  className="w-full sm:w-auto px-8 py-3 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Reset Changes
                </button>

                <button
                  type="submit"
                  disabled={!isDirty || loading}
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-medium rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}