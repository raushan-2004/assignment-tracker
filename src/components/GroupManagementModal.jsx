import React, { useState } from 'react';
import { Users, X, Plus, Check, Clock, Trash2, UserPlus } from 'lucide-react';

// Group Management Modal for Students
const GroupManagementModal = ({
  course,
  student,
  allStudents,
  groups,
  groupInvitations,
  onClose,
  onCreateGroup,
  onSendInvitation,
  onAcceptInvitation,
  onRejectInvitation,
  onLeaveGroup,
}) => {
  const [activeTab, setActiveTab] = useState('myGroup'); // myGroup, createGroup, invitations
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [errors, setErrors] = useState({});

  // Get student's current group in this course
  const myGroup = groups.find(
    (g) => g.courseId === course.id && g.members.includes(student.id)
  );

  // Get pending invitations for this student in this course
  const pendingInvitations = groupInvitations.filter(
    (inv) => inv.courseId === course.id && inv.inviteeId === student.id && inv.status === 'pending'
  );

  // Get students enrolled in the course (excluding current student and already grouped students)
  const enrolledStudents = allStudents.filter(
    (s) => course.enrolledStudents.includes(s.id) && s.id !== student.id
  );

  // Get students who are not in any group for this course
  const availableStudents = enrolledStudents.filter(
    (s) => !groups.some((g) => g.courseId === course.id && g.members.includes(s.id))
  );

  // Handle member selection
  const toggleMember = (memberId) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
    if (errors.members) {
      setErrors((prev) => ({ ...prev, members: '' }));
    }
  };

  // Validate group creation
  const validateGroupCreation = () => {
    const newErrors = {};
    if (!groupName.trim()) newErrors.groupName = 'Group name is required';
    if (selectedMembers.length === 0) newErrors.members = 'Select at least one member';
    return newErrors;
  };

  // Handle group creation
  const handleCreateGroup = () => {
    const newErrors = validateGroupCreation();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onCreateGroup(groupName, selectedMembers);
    setGroupName('');
    setSelectedMembers([]);
    setErrors({});
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Modal Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white text-black bg-opacity-20 rounded-lg">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Group Management</h2>
                <p className="text-purple-100 text-sm mt-1">{course.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setActiveTab('myGroup')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'myGroup'
                  ? 'bg-white text-purple-600'
                  : 'bg-white bg-opacity-20 text-black hover:bg-opacity-30'
              }`}
            >
              My Group {myGroup && '✓'}
            </button>
            <button
              onClick={() => setActiveTab('createGroup')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'createGroup'
                  ? 'bg-white text-purple-600'
                  : 'bg-white bg-opacity-20 text-black hover:bg-opacity-30'
              }`}
            >
              Create Group
            </button>
            <button
              onClick={() => setActiveTab('invitations')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all relative ${
                activeTab === 'invitations'
                  ? 'bg-white text-purple-600'
                  : 'bg-white bg-opacity-20 text-black hover:bg-opacity-30'
              }`}
            >
              Invitations
              {pendingInvitations.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {pendingInvitations.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* My Group Tab */}
          {activeTab === 'myGroup' && (
            <div>
              {myGroup ? (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-slate-800">{myGroup.name}</h3>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                        {myGroup.members.length} Members
                      </span>
                    </div>

                    {/* Group Members */}
                    <div className="space-y-3">
                      {myGroup.members.map((memberId) => {
                        const member = allStudents.find((s) => s.id === memberId);
                        const isLeader = memberId === myGroup.leaderId;
                        const isMe = memberId === student.id;
                        return (
                          <div
                            key={memberId}
                            className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-100"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                isLeader ? 'bg-purple-500 text-white' : 'bg-slate-200 text-slate-600'
                              }`}>
                                {member?.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-800">
                                  {member?.name} {isMe && '(You)'}
                                </p>
                                <p className="text-sm text-slate-500">{member?.email}</p>
                              </div>
                            </div>
                            {isLeader && (
                              <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white rounded-full text-xs font-bold">
                                Leader
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Leave Group Button */}
                    <button
                      onClick={() => onLeaveGroup(myGroup.id)}
                      className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-semibold"
                    >
                      <Trash2 className="w-4 h-4" />
                      Leave Group
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-600 mb-2">
                    No Group Yet
                  </h3>
                  <p className="text-slate-500 mb-4">
                    Create a new group or accept an invitation to join one.
                  </p>
                  <button
                    onClick={() => setActiveTab('createGroup')}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-lg hover:from-purple-700 hover:to-fuchsia-700 transition-all shadow-md"
                  >
                    Create Group
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Create Group Tab */}
          {activeTab === 'createGroup' && (
            <div>
              {myGroup ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-600 mb-2">
                    Already in a Group
                  </h3>
                  <p className="text-slate-500">
                    You can only be in one group per course. Leave your current group to create a new one.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Group Name */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Group Name *
                    </label>
                    <input
                      type="text"
                      value={groupName}
                      onChange={(e) => {
                        setGroupName(e.target.value);
                        if (errors.groupName) setErrors((prev) => ({ ...prev, groupName: '' }));
                      }}
                      placeholder="e.g., Team Alpha"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        errors.groupName
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-slate-300 focus:ring-purple-500'
                      }`}
                    />
                    {errors.groupName && (
                      <p className="text-red-500 text-sm mt-1">{errors.groupName}</p>
                    )}
                  </div>

                  {/* Select Members */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Invite Members * (They will receive invitations)
                    </label>
                    {availableStudents.length === 0 ? (
                      <div className="text-center py-8 bg-slate-50 rounded-lg">
                        <p className="text-slate-500">
                          No available students to invite. All students are already in groups.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-64 overflow-y-auto border border-slate-200 rounded-lg p-3">
                        {availableStudents.map((studentOption) => (
                          <button
                            key={studentOption.id}
                            type="button"
                            onClick={() => toggleMember(studentOption.id)}
                            className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                              selectedMembers.includes(studentOption.id)
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                                selectedMembers.includes(studentOption.id)
                                  ? 'bg-purple-500 text-white'
                                  : 'bg-slate-200 text-slate-600'
                              }`}>
                                {studentOption.name.charAt(0)}
                              </div>
                              <div className="text-left">
                                <p className="font-semibold text-slate-800">{studentOption.name}</p>
                                <p className="text-xs text-slate-500">{studentOption.email}</p>
                              </div>
                            </div>
                            {selectedMembers.includes(studentOption.id) && (
                              <Check className="w-5 h-5 text-purple-600" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                    {errors.members && (
                      <p className="text-red-500 text-sm mt-1">{errors.members}</p>
                    )}
                    {selectedMembers.length > 0 && (
                      <p className="text-sm text-slate-600 mt-2">
                        {selectedMembers.length} member{selectedMembers.length > 1 ? 's' : ''} selected
                      </p>
                    )}
                  </div>

                  {/* Create Button */}
                  <button
                    onClick={handleCreateGroup}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-lg hover:from-purple-700 hover:to-fuchsia-700 transition-all shadow-md hover:shadow-lg font-semibold"
                  >
                    <Plus className="w-5 h-5" />
                    Create Group & Send Invitations
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Invitations Tab */}
          {activeTab === 'invitations' && (
            <div>
              {pendingInvitations.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-600 mb-2">
                    No Pending Invitations
                  </h3>
                  <p className="text-slate-500">
                    You don't have any group invitations at the moment.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-slate-600 mb-4">
                    You have {pendingInvitations.length} pending invitation{pendingInvitations.length > 1 ? 's' : ''}
                  </p>
                  {pendingInvitations.map((invitation) => {
                    const inviterGroup = groups.find((g) => g.id === invitation.groupId);
                    const inviter = allStudents.find((s) => s.id === invitation.inviterId);
                    return (
                      <div
                        key={invitation.id}
                        className="border-2 border-purple-200 rounded-xl p-5 bg-gradient-to-br from-purple-50 to-white"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-bold text-slate-800">
                              {inviterGroup?.name}
                            </h4>
                            <p className="text-sm text-slate-600 mt-1">
                              Invited by {inviter?.name}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              {new Date(invitation.createdAt).toLocaleDateString()} at{' '}
                              {new Date(invitation.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                          <UserPlus className="w-8 h-8 text-purple-500" />
                        </div>

                        {/* Group Members Preview */}
                        {inviterGroup && (
                          <div className="mb-4">
                            <p className="text-xs font-semibold text-slate-600 mb-2">Current Members:</p>
                            <div className="flex flex-wrap gap-2">
                              {inviterGroup.members.map((memberId) => {
                                const member = allStudents.find((s) => s.id === memberId);
                                return (
                                  <span
                                    key={memberId}
                                    className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs"
                                  >
                                    {member?.name}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <button
                            onClick={() => onAcceptInvitation(invitation.id)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-md font-semibold"
                          >
                            <Check className="w-4 h-4" />
                            Accept
                          </button>
                          <button
                            onClick={() => onRejectInvitation(invitation.id)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-all font-semibold"
                          >
                            <X className="w-4 h-4" />
                            Decline
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupManagementModal;
