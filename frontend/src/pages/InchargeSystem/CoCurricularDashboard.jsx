

import React, { useState } from "react";
import { Menu, X, Calendar, Users, Edit, Trash2, Send, Plus, FileText, CheckCircle, LogOut, User } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const CoCurricularDashboard = () => {
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(true);
    const [activeSection, setActiveSection] = useState("dashboard");
    const [events, setEvents] = useState([
        { id: 1, name: 'Tech Conference 2024', date: '2024-11-15', venue: 'Main Auditorium', participants: 150, status: 'upcoming', category: 'Technical' },
        { id: 2, name: 'Sports Gala', date: '2024-11-20', venue: 'Sports Complex', participants: 200, status: 'upcoming', category: 'Sports' },
        { id: 3, name: 'Cultural Festival', date: '2024-12-01', venue: 'University Grounds', participants: 300, status: 'upcoming', category: 'Cultural' },
    ]);
    const [responsibilities, setResponsibilities] = useState([
        { id: 1, task: 'Organize Annual Tech Fest', assignedBy: 'Advisory Board', deadline: '2024-12-01', status: 'In Progress' },
        { id: 2, task: 'Coordinate Sports Activities', assignedBy: 'Advisory Board', deadline: '2024-11-30', status: 'Pending' },
        { id: 3, task: 'Manage Cultural Events', assignedBy: 'Advisory Board', deadline: '2024-12-15', status: 'In Progress' },
    ]);
    const [showEventForm, setShowEventForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [newEvent, setNewEvent] = useState({
        name: '',
        date: '',
        venue: '',
        participants: 0,
        category: 'Technical'
    });

    // State for user profile
    const [userProfile, setUserProfile] = useState({
        name: 'Prof. Sarah Ahmed',
        role: 'Co-Curricular Incharge',
        email: 'sarah.ahmed@university.edu',
        phone: '123-456-7890'
    });
    const [editingProfile, setEditingProfile] = useState(false);
    const [tempProfile, setTempProfile] = useState({}); // For profile editing form

    const handleCreateEvent = () => {
        if (newEvent.name && newEvent.date && newEvent.venue) {
            if (editingEvent) {
                setEvents(events.map(e => e.id === editingEvent.id ? { ...editingEvent, ...newEvent } : e));
                setEditingEvent(null);
                alert('✅ Event updated successfully!');
            } else {
                setEvents([...events, {
                    id: events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1, // Ensure unique ID
                    ...newEvent,
                    status: 'upcoming',
                    participants: parseInt(newEvent.participants) || 0
                }]);
                alert('✅ Event created successfully!');
            }
            setNewEvent({ name: '', date: '', venue: '', participants: 0, category: 'Technical' });
            setShowEventForm(false);
        } else {
            alert('❌ Please fill all required fields');
        }
    };

    const handleEditEvent = (event) => {
        setEditingEvent(event);
        setNewEvent({
            name: event.name,
            date: event.date,
            venue: event.venue,
            participants: event.participants,
            category: event.category
        });
        setShowEventForm(true);
        setActiveSection('create'); // Navigate to create section for editing
    };

    const handleDeleteEvent = (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            setEvents(events.filter(e => e.id !== id));
            alert('🗑️ Event deleted successfully');
        }
    };

    const handleSendInvitation = (event) => {
        alert(`📧 Invitations Sent Successfully!\n\nEvent: ${event.name}\nVenue: ${event.venue}\nDate: ${event.date}\nExpected Participants: ${event.participants}\n\n✅ Email notifications sent to all students and faculty!`);
    };

    const handleUpdateResponsibilityStatus = (id) => {
        setResponsibilities(responsibilities.map(resp =>
            resp.id === id
                ? { ...resp, status: resp.status === 'In Progress' ? 'Completed' : 'In Progress' }
                : resp
        ));
        alert('Responsibility status updated!');
    };

    const handleEditProfile = () => {
        setTempProfile({ ...userProfile }); // Copy current profile to temp for editing
        setEditingProfile(true);
        setActiveSection('profile'); // Navigate to profile section
    };

    const handleSaveProfile = () => {
        setUserProfile({ ...tempProfile });
        setEditingProfile(false);
        alert('✅ Profile updated successfully!');
    };

    const handleCancelProfileEdit = () => {
        setEditingProfile(false);
        setActiveSection('dashboard'); // Go back to dashboard or previous section
    };

    // const handleLogout = () => {
    //     if (window.confirm('Are you sure you want to logout?')) {
    //         navigate("/co-curricular-login");
    //     }

    const handleLogout = () => {
        // Create a custom confirmation popup using the browser's confirm dialog alternative
        const confirmBox = document.createElement("div");
        confirmBox.style.position = "fixed";
        confirmBox.style.top = "0";
        confirmBox.style.left = "0";
        confirmBox.style.width = "100%";
        confirmBox.style.height = "100%";
        confirmBox.style.backgroundColor = "rgba(0,0,0,0.5)";
        confirmBox.style.display = "flex";
        confirmBox.style.justifyContent = "center";
        confirmBox.style.alignItems = "center";
        confirmBox.style.zIndex = "9999";

        // Create modal content
        const modal = document.createElement("div");
        modal.style.background = "#fff";
        modal.style.padding = "25px 30px";
        modal.style.borderRadius = "12px";
        modal.style.textAlign = "center";
        modal.style.width = "320px";
        modal.style.boxShadow = "0 5px 20px rgba(0, 0, 0, 0.2)";
        modal.innerHTML = `
      <h3 style="margin-bottom: 15px; font-size: 18px;">Confirm Logout</h3>
      <p style="margin-bottom: 20px; color: #555;">Are you sure you want to log out?</p>
      <button id="yesBtn" style="background-color:#23a6d5;color:white;border:none;padding:8px 16px;border-radius:8px;cursor:pointer;margin-right:10px;">Yes</button>
      <button id="noBtn" style="background-color:#f2f2f2;color:#333;border:none;padding:8px 16px;border-radius:8px;cursor:pointer;">Cancel</button>
    `;

        confirmBox.appendChild(modal);
        document.body.appendChild(confirmBox);

        // Add event listeners
        modal.querySelector("#yesBtn").addEventListener("click", () => {
            document.body.removeChild(confirmBox);
            navigate("/co-curricular-login");
        });

        modal.querySelector("#noBtn").addEventListener("click", () => {
            document.body.removeChild(confirmBox);
        });
    };

    const stats = {
        totalEvents: events.length,
        upcoming: events.filter(e => e.status === 'upcoming').length,
        totalParticipants: events.reduce((sum, e) => sum + e.participants, 0),
        responsibilities: responsibilities.length
    };

    return (
        <div style={styles.container}>
            {/* Sidebar Drawer */}
            <div style={{ ...styles.drawer, width: drawerOpen ? '280px' : '0' }}>
                <div style={styles.drawerHeader}>
                    <div style={styles.profileSection}>
                        <div style={styles.avatar}>{userProfile.name.charAt(0)}</div>
                        <div>
                            <h4 style={styles.userName}>{userProfile.name}</h4>
                            <p style={styles.userRole}>{userProfile.role}</p>
                        </div>
                    </div>
                </div>

                <nav style={styles.nav}>
                    <div
                        style={activeSection === 'dashboard' ? styles.navItemActive : styles.navItem}
                        onClick={() => { setActiveSection('dashboard'); setShowEventForm(false); setEditingProfile(false); }}
                    >
                        <Calendar size={20} /> Dashboard Overview
                    </div>
                    <div
                        style={activeSection === 'responsibilities' ? styles.navItemActive : styles.navItem}
                        onClick={() => { setActiveSection('responsibilities'); setShowEventForm(false); setEditingProfile(false); }}
                    >
                        <FileText size={20} /> View Responsibilities
                    </div>
                    <div
                        style={activeSection === 'create' ? styles.navItemActive : styles.navItem}
                        onClick={() => {
                            setActiveSection('create');
                            setShowEventForm(true);
                            setEditingEvent(null); // Clear editing state for new event
                            setNewEvent({ name: '', date: '', venue: '', participants: 0, category: 'Technical' });
                            setEditingProfile(false);
                        }}
                    >
                        <Plus size={20} /> Create New Event
                    </div>
                    <div
                        style={activeSection === 'manage' ? styles.navItemActive : styles.navItem}
                        onClick={() => { setActiveSection('manage'); setShowEventForm(false); setEditingProfile(false); }}
                    >
                        <Edit size={20} /> Manage Events
                    </div>
                    <div
                        style={activeSection === 'participants' ? styles.navItemActive : styles.navItem}
                        onClick={() => { setActiveSection('participants'); setShowEventForm(false); setEditingProfile(false); }}
                    >
                        <Users size={20} /> View Participants
                    </div>
                    <div
                        style={activeSection === 'invitations' ? styles.navItemActive : styles.navItem}
                        onClick={() => { setActiveSection('invitations'); setShowEventForm(false); setEditingProfile(false); }}
                    >
                        <Send size={20} /> Send Invitations
                    </div>
                    <div
                        style={activeSection === 'profile' ? styles.navItemActive : styles.navItem}
                        onClick={handleEditProfile}
                    >
                        <User size={20} /> Edit Profile
                    </div>
                    <div
                        style={styles.navItem} // Logout doesn't need active state
                        onClick={handleLogout}
                    >
                        <LogOut size={20} /> Logout
                    </div>
                </nav>
            </div>

            {/* Main Content */}
            <div style={{ ...styles.mainContent, marginLeft: drawerOpen ? '280px' : '0' }}>
                <div style={styles.topbar}>
                    <button style={styles.menuBtn} onClick={() => setDrawerOpen(!drawerOpen)}>
                        {drawerOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <h2 style={styles.pageTitle}>Co-Curricular Management System</h2>
                </div>

                <div style={styles.content}>
                    {/* Dashboard Overview */}
                    {activeSection === 'dashboard' && (
                        <div>
                            <h3 style={styles.sectionTitle}>📊 Dashboard Overview</h3>
                            <div style={styles.statsGrid}>
                                <div style={{ ...styles.statCard, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                                    <div style={styles.statIcon}>📅</div>
                                    <div>
                                        <h3 style={styles.statNumber}>{stats.totalEvents}</h3>
                                        <p style={styles.statLabel}>Total Events</p>
                                    </div>
                                </div>
                                <div style={{ ...styles.statCard, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                                    <div style={styles.statIcon}>⏰</div>
                                    <div>
                                        <h3 style={styles.statNumber}>{stats.upcoming}</h3>
                                        <p style={styles.statLabel}>Upcoming Events</p>
                                    </div>
                                </div>
                                <div style={{ ...styles.statCard, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                                    <div style={styles.statIcon}>👥</div>
                                    <div>
                                        <h3 style={styles.statNumber}>{stats.totalParticipants}</h3>
                                        <p style={styles.statLabel}>Total Participants</p>
                                    </div>
                                </div>
                                <div style={{ ...styles.statCard, background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
                                    <div style={styles.statIcon}>📋</div>
                                    <div>
                                        <h3 style={styles.statNumber}>{stats.responsibilities}</h3>
                                        <p style={styles.statLabel}>Responsibilities</p>
                                    </div>
                                </div>
                            </div>

                            <h3 style={styles.sectionTitle}>🎯 Upcoming Events</h3>
                            <div style={styles.eventsGrid}>
                                {events.slice(0, 3).map(event => (
                                    <div key={event.id} style={styles.eventCard}>
                                        <div style={styles.eventHeader}>
                                            <span style={styles.categoryBadge}>{event.category}</span>
                                            <span style={{ ...styles.statusBadge, backgroundColor: event.status === 'upcoming' ? '#3498db' : '#2ecc71' }}>{event.status}</span>
                                        </div>
                                        <h4 style={styles.eventName}>{event.name}</h4>
                                        <div style={styles.eventDetails}>
                                            <p>📅 {event.date}</p>
                                            <p>📍 {event.venue}</p>
                                            <p>👥 {event.participants} participants</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* View Responsibilities */}
                    {activeSection === 'responsibilities' && (
                        <div>
                            <h3 style={styles.sectionTitle}>📋 Assigned Responsibilities</h3>
                            <p style={styles.subtitle}>Tasks assigned by the Advisory Board</p>
                            <div style={styles.responsibilitiesContainer}>
                                {responsibilities.map(resp => (
                                    <div key={resp.id} style={styles.responsibilityCard}>
                                        <div style={styles.respHeader}>
                                            <h4 style={styles.respTitle}>{resp.task}</h4>
                                            <span style={{
                                                ...styles.respStatus,
                                                backgroundColor: resp.status === 'In Progress' ? '#4caf50' : (resp.status === 'Pending' ? '#ff9800' : '#888')
                                            }}>
                                                {resp.status}
                                            </span>
                                        </div>
                                        <div style={styles.respBody}>
                                            <p><strong>Assigned By:</strong> {resp.assignedBy}</p>
                                            <p><strong>Deadline:</strong> {resp.deadline}</p>
                                        </div>
                                        <button style={styles.updateBtn} onClick={() => handleUpdateResponsibilityStatus(resp.id)}>
                                            <CheckCircle size={16} /> Mark as {resp.status === 'In Progress' ? 'Completed' : 'In Progress'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Create/Edit Event */}
                    {activeSection === 'create' && (
                        <div>
                            <h3 style={styles.sectionTitle}>
                                {editingEvent ? '✏️ Edit Event' : '➕ Create New Event'}
                            </h3>
                            <div style={styles.formCard}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Event Name *</label>
                                    <input
                                        type="text"
                                        placeholder="Enter event name"
                                        value={newEvent.name}
                                        onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                                        style={styles.input}
                                    />
                                </div>
                                <div style={styles.formRow}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Event Date *</label>
                                        <input
                                            type="date"
                                            value={newEvent.date}
                                            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                            style={styles.input}
                                        />
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Category *</label>
                                        <select
                                            value={newEvent.category}
                                            onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                                            style={styles.input}
                                        >
                                            <option value="Technical">Technical</option>
                                            <option value="Sports">Sports</option>
                                            <option value="Cultural">Cultural</option>
                                            <option value="Academic">Academic</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Venue *</label>
                                    <input
                                        type="text"
                                        placeholder="Enter venue location"
                                        value={newEvent.venue}
                                        onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                                        style={styles.input}
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Expected Participants</label>
                                    <input
                                        type="number"
                                        placeholder="Number of expected participants"
                                        value={newEvent.participants}
                                        onChange={(e) => setNewEvent({ ...newEvent, participants: e.target.value })}
                                        style={styles.input}
                                    />
                                </div>
                                <div style={styles.formActions}>
                                    <button style={styles.submitBtn} onClick={handleCreateEvent}>
                                        <Plus size={18} /> {editingEvent ? 'Update Event' : 'Create Event'}
                                    </button>
                                    {editingEvent && (
                                        <button
                                            style={styles.cancelBtn}
                                            onClick={() => {
                                                setEditingEvent(null);
                                                setNewEvent({ name: '', date: '', venue: '', participants: 0, category: 'Technical' });
                                                setShowEventForm(false);
                                                setActiveSection('manage');
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Manage Events (Edit/Delete) */}
                    {activeSection === 'manage' && (
                        <div>
                            <h3 style={styles.sectionTitle}>🎯 Manage Events</h3>
                            <p style={styles.subtitle}>Edit or delete existing events</p>
                            <div style={styles.tableContainer}>
                                <table style={styles.table}>
                                    <thead>
                                        <tr style={styles.tableHeader}>
                                            <th style={styles.th}>Event Name</th>
                                            <th style={styles.th}>Date</th>
                                            <th style={styles.th}>Venue</th>
                                            <th style={styles.th}>Category</th>
                                            <th style={styles.th}>Participants</th>
                                            <th style={styles.th}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {events.map(event => (
                                            <tr key={event.id} style={styles.tableRow}>
                                                <td style={styles.td}>{event.name}</td>
                                                <td style={styles.td}>{event.date}</td>
                                                <td style={styles.td}>{event.venue}</td>
                                                <td style={styles.td}>
                                                    <span style={styles.categoryTag}>{event.category}</span>
                                                </td>
                                                <td style={styles.td}>{event.participants}</td>
                                                <td style={styles.td}>
                                                    <div style={styles.actionButtons}>
                                                        <button
                                                            style={styles.editBtn}
                                                            onClick={() => handleEditEvent(event)}
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            style={styles.deleteBtn}
                                                            onClick={() => handleDeleteEvent(event.id)}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* View Participants */}
                    {activeSection === 'participants' && (
                        <div>
                            <h3 style={styles.sectionTitle}>👥 Event Participants Overview</h3>
                            <p style={styles.subtitle}>Summary of registered participants for each event.</p>
                            <div style={styles.participantsGrid}>
                                {events.map(event => (
                                    <div key={event.id} style={styles.participantCard}>
                                        <h4 style={styles.participantEventName}>{event.name}</h4>
                                        <div style={styles.participantInfo}>
                                            <div style={styles.infoRow}>
                                                <span>📅 Date:</span>
                                                <span>{event.date}</span>
                                            </div>
                                            <div style={styles.infoRow}>
                                                <span>📍 Venue:</span>
                                                <span>{event.venue}</span>
                                            </div>
                                            <div style={styles.infoRow}>
                                                <span>👥 Registered:</span>
                                                <span style={styles.participantCount}>{event.participants}</span>
                                            </div>
                                        </div>
                                        <button
                                            style={styles.viewDetailsBtn}
                                            onClick={() => alert(`Detailed participant list for ${event.name}\n\nTotal Registered: ${event.participants}\n\n(In a full implementation, this would navigate to a detailed participant list.)`)}
                                        >
                                            View Full List
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Send Invitations */}
                    {activeSection === 'invitations' && (
                        <div>
                            <h3 style={styles.sectionTitle}>📧 Send Event Invitations</h3>
                            <p style={styles.subtitle}>Send email invitations to students and faculty for upcoming events.</p>
                            <div style={styles.invitationsGrid}>
                                {events.map(event => (
                                    <div key={event.id} style={styles.invitationCard}>
                                        <div style={styles.invCardHeader}>
                                            <h4>{event.name}</h4>
                                            <span style={styles.categoryBadge}>{event.category}</span>
                                        </div>
                                        <div style={styles.invCardBody}>
                                            <p><strong>Date:</strong> {event.date}</p>
                                            <p><strong>Venue:</strong> {event.venue}</p>
                                            <p><strong>Expected Participants:</strong> {event.participants}</p>
                                        </div>
                                        <button
                                            style={styles.sendInvBtn}
                                            onClick={() => handleSendInvitation(event)}
                                        >
                                            <Send size={18} /> Send Invitations
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Edit Profile Section */}
                    {activeSection === 'profile' && (
                        <div>
                            <h3 style={styles.sectionTitle}>👤 Edit Profile</h3>
                            <p style={styles.subtitle}>Update your personal and contact information.</p>
                            <div style={styles.formCard}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Full Name</label>
                                    <input
                                        type="text"
                                        value={tempProfile.name}
                                        onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                                        style={styles.input}
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Role</label>
                                    <input
                                        type="text"
                                        value={tempProfile.role}
                                        onChange={(e) => setTempProfile({ ...tempProfile, role: e.target.value })}
                                        style={styles.input}
                                        readOnly // Role might not be editable by user
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Email</label>
                                    <input
                                        type="email"
                                        value={tempProfile.email}
                                        onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                                        style={styles.input}
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Phone Number</label>
                                    <input
                                        type="text"
                                        value={tempProfile.phone}
                                        onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                                        style={styles.input}
                                    />
                                </div>
                                <div style={styles.formActions}>
                                    <button style={styles.submitBtn} onClick={handleSaveProfile}>
                                        <CheckCircle size={18} /> Save Changes
                                    </button>
                                    <button style={styles.cancelBtn} onClick={handleCancelProfileEdit}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f5f7fa',
        fontFamily: 'Arial, sans-serif',
    },
    drawer: {
        backgroundColor: '#2c3e50',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        zIndex: 1000,
    },
    drawerHeader: {
        padding: '25px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
    },
    profileSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    avatar: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: '#3498db',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        color: 'white',
        fontWeight: 'bold',
    },
    userName: {
        color: 'white',
        margin: 0,
        fontSize: '16px',
    },
    userRole: {
        color: '#95a5a6',
        margin: '3px 0 0 0',
        fontSize: '13px',
    },
    nav: {
        padding: '20px 0',
    },
    navItem: {
        padding: '15px 20px',
        color: '#ecf0f1',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        transition: 'all 0.3s',
        fontSize: '14px',
    },
    navItemActive: {
        padding: '15px 20px',
        color: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: '#34495e',
        borderLeft: '4px solid #3498db',
        fontWeight: 'bold',
        fontSize: '14px',
    },
    mainContent: {
        flex: 1,
        transition: 'margin-left 0.3s ease',
    },
    topbar: {
        backgroundColor: 'white',
        padding: '20px 30px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
    },
    menuBtn: {
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '8px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        transition: 'background 0.3s',
    },
    pageTitle: {
        margin: 0,
        fontSize: '24px',
        color: '#2c3e50',
        fontWeight: '600',
    },
    content: {
        padding: '30px',
    },
    sectionTitle: {
        fontSize: '22px',
        color: '#2c3e50',
        marginBottom: '10px',
        fontWeight: '600',
    },
    subtitle: {
        color: '#7f8c8d',
        marginBottom: '25px',
        fontSize: '14px',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '35px',
    },
    statCard: {
        padding: '25px',
        borderRadius: '12px',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    },
    statIcon: {
        fontSize: '40px',
    },
    statNumber: {
        fontSize: '32px',
        fontWeight: 'bold',
        margin: 0,
    },
    statLabel: {
        fontSize: '14px',
        opacity: 0.9,
        margin: '5px 0 0 0',
    },
    eventsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
        marginTop: '20px',
    },
    eventCard: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        cursor: 'pointer',
    },
    eventHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '15px',
    },
    categoryBadge: {
        padding: '5px 12px',
        backgroundColor: '#3498db',
        color: 'white',
        borderRadius: '20px',
        fontSize: '12px',
    },
    statusBadge: {
        padding: '5px 12px',
        backgroundColor: '#2ecc71', // Default for upcoming
        color: 'white',
        borderRadius: '20px',
        fontSize: '12px',
    },
    eventName: {
        fontSize: '18px',
        color: '#2c3e50',
        marginBottom: '12px',
    },
    eventDetails: {
        fontSize: '14px',
        color: '#7f8c8d',
    },
    responsibilitiesContainer: {
        display: 'grid',
        gap: '20px',
    },
    responsibilityCard: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    },
    respHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px',
    },
    respTitle: {
        fontSize: '18px',
        color: '#2c3e50',
        margin: 0,
    },
    respStatus: {
        padding: '6px 14px',
        borderRadius: '20px',
        fontSize: '12px',
        color: 'white',
        fontWeight: 'bold',
    },
    respBody: {
        fontSize: '14px',
        color: '#7f8c8d',
        marginBottom: '15px',
    },
    updateBtn: {
        padding: '10px 20px',
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'background 0.3s',
    },
    formCard: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        maxWidth: '700px',
    },
    formGroup: {
        marginBottom: '20px',
    },
    formRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        color: '#2c3e50',
        fontSize: '14px',
        fontWeight: '500',
    },
    input: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '14px',
        boxSizing: 'border-box',
        transition: 'border 0.3s',
    },
    formActions: {
        display: 'flex',
        gap: '10px',
        marginTop: '25px',
    },
    submitBtn: {
        padding: '12px 30px',
        backgroundColor: '#2ecc71',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '15px',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'background 0.3s',
    },
    cancelBtn: {
        padding: '12px 30px',
        backgroundColor: '#95a5a6',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '15px',
        fontWeight: '500',
    },
    tableContainer: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        overflowX: 'auto',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    tableHeader: {
        backgroundColor: '#f8f9fa',
    },
    th: {
        padding: '15px',
        textAlign: 'left',
        fontWeight: '600',
        color: '#2c3e50',
        fontSize: '14px',
    },
    tableRow: {
        borderBottom: '1px solid #ecf0f1',
    },
    td: {
        padding: '15px',
        color: '#7f8c8d',
        fontSize: '14px',
    },
    categoryTag: {
        padding: '5px 12px',
        backgroundColor: '#e8f4f8',
        color: '#3498db',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '500',
    },
    actionButtons: {
        display: 'flex',
        gap: '8px',
    },
    editBtn: {
        padding: '8px 12px',
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.3s',
        '&:hover': {
            backgroundColor: '#2980b9',
        }
    },
    deleteBtn: {
        padding: '8px 12px',
        backgroundColor: '#e74c3c',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.3s',
        '&:hover': {
            backgroundColor: '#c0392b',
        }
    },
    participantsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginTop: '20px',
    },
    participantCard: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'transform 0.3s, box-shadow 0.3s',
    },
    participantEventName: {
        fontSize: '18px',
        color: '#2c3e50',
        marginBottom: '15px',
        borderBottom: '1px solid #eee',
        paddingBottom: '10px',
    },
    participantInfo: {
        marginBottom: '20px',
    },
    infoRow: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '8px 0',
        borderBottom: '1px dashed #f0f0f0',
        fontSize: '14px',
        color: '#555',
    },
    participantCount: {
        fontWeight: 'bold',
        color: '#3498db',
    },
    viewDetailsBtn: {
        padding: '10px 20px',
        backgroundColor: '#f39c12',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        marginTop: '15px',
        width: '100%',
        transition: 'background 0.3s',
    },
    invitationsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px',
        marginTop: '20px',
    },
    invitationCard: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    invCardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px',
        borderBottom: '1px solid #eee',
        paddingBottom: '10px',
    },
    invCardBody: {
        fontSize: '14px',
        color: '#7f8c8d',
        marginBottom: '20px',
        flexGrow: 1,
    },
    sendInvBtn: {
        padding: '12px 25px',
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '15px',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        width: '100%',
        transition: 'background 0.3s',
    }
};

export default CoCurricularDashboard;