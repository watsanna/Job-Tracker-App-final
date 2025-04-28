import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import './help.css';

const Help = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [jobs, setJobs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [studentMessages, setStudentMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientData, setRecipientData] = useState(null);
  const [offerCompanies, setOfferCompanies] = useState([]);
  const [stats, setStats] = useState({
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
  });

  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (!userData) return;

    fetchJobs();

    if (userData.role === 'student') {
      fetchMessages();

      const subscription = supabase
        .channel('public:messages')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
          const newMsg = payload.new;
          if (newMsg.sender_id === userData.id || newMsg.recipient_id === userData.id) {
            setMessages((prev) => [...prev, newMsg]);
          }
        })
        .subscribe();

      return () => supabase.removeChannel(subscription);
    }

    if (userData.role === 'staff') {
      fetchStudentMessages();

      const subscription = supabase
        .channel('public:messages')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
          const newMsg = payload.new;
          if (recipientData && (newMsg.sender_id === recipientData.id || newMsg.recipient_id === recipientData.id)) {
            setMessages((prev) => [...prev, newMsg]);
          }
        })
        .subscribe();

      return () => supabase.removeChannel(subscription);
    }
  }, [userData, recipientData]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchUserData = async () => {
    const userEmail = localStorage.getItem('userEmail');

    if (!userEmail) {
      setError('User email not found. Please log in again.');
      return;
    }

    const { data, error } = await supabase
      .from('usersData')
      .select('id, email, role')
      .eq('email', userEmail)
      .single();

    if (error || !data) {
      console.error('Error fetching user data:', error?.message);
      setError('Error fetching user data.');
      return;
    }

    setUserData(data);
  };

  const fetchJobs = async () => {
    const { data, error } = await supabase.from('jobs').select('*');

    if (error) {
      console.error('Error fetching jobs:', error.message);
      setError('Error fetching job data');
      return;
    }

    setJobs(data);
    processStats(data);
  };

  const processStats = (jobs) => {
    const applied = jobs.filter((job) => job.status === 'applied').length;
    const interview = jobs.filter((job) => job.status === 'interview').length;
    const offer = jobs.filter((job) => job.status === 'offer').length;
    const rejected = jobs.filter((job) => job.status === 'rejected').length;

    const offersList = jobs
      .filter((job) => job.status === 'offer')
      .map((job) => job.company_name);

    const uniqueOffersList = [...new Set(offersList)];

    setStats({
      applied,
      interview,
      offer,
      rejected,
    });

    setOfferCompanies(uniqueOffersList);
  };

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userData.id},recipient_id.eq.${userData.id}`)
      .order('created_at', { ascending: true });

    if (!error) {
      setMessages(data);
    } else {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchStudentMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('sender_role', 'student')
      .order('created_at', { ascending: false });

    if (!error) {
      setStudentMessages(data);
    } else {
      console.error('Error fetching student messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    let recipientId = null;

    if (userData.role === 'student') {
      // students always send to staff
      const { data } = await supabase
        .from('usersData')
        .select('id')
        .eq('role', 'staff')
        .limit(1)
        .single();

      recipientId = data?.id;
    } else if (userData.role === 'staff' && recipientData) {
      recipientId = recipientData.id;
    }

    if (!recipientId) {
      alert('Recipient not found.');
      return;
    }

    const { error } = await supabase.from('messages').insert([
      {
        sender_id: userData.id,
        recipient_id: recipientId,
        sender_role: userData.role,
        message: newMessage,
      },
    ]);

    if (!error) {
      setNewMessage('');
    } else {
      console.error('Error sending message:', error);
    }
  };

  const handleEmailSubmit = async () => {
    if (!recipientEmail) return;

    const { data, error } = await supabase
      .from('usersData')
      .select('id, email')
      .eq('email', recipientEmail)
      .single();

    if (error || !data) {
      alert('Student not found.');
      return;
    }

    setRecipientData(data);
    fetchMessages(); // reload messages for this student
  };

  return (
    <div className="help-page">
      <h1 className="help-title">Help Center</h1>

      {error && <p className="error-message">{error}</p>}

      {userData ? (
        <>
          {userData.role === 'student' && (
            <>
              <div className="chat-container">
                <h2>Connect to Career Services Chat Box</h2>

                <div className="chat-messages">
                  {messages.length === 0 && <p>No messages yet.</p>}
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`chat-message ${msg.sender_id === userData.id ? 'self' : 'other'}`}
                    >
                      <div className="message-meta">
                        {msg.sender_id === userData.id ? 'You' : 'Staff'}
                        <span className="timestamp">
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="message-content">{msg.message}</div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="chat-input-container">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button onClick={handleSendMessage}>Send</button>
                </div>
              </div>

              <div className="faq-container">
                <h2>Frequently Asked Questions</h2>

                <div className="faq-item">
                  <h4>How to delete my account?</h4>
                  <p>Go to your profile page, enter your password, and click 'Delete Account'.</p>
                </div>

                <div className="faq-item">
                  <h4>How to add a job?</h4>
                  <p>Go to the 'Add Job' page and submit your job application details.</p>
                </div>
              </div>
            </>
          )}

          {userData.role === 'staff' && (
            <>
              <div className="chat-container">
                <h2>Chat with a Student</h2>

                <div className="chat-input-container">
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="Enter student email..."
                    onKeyDown={(e) => e.key === 'Enter' && handleEmailSubmit()}
                  />
                  <button onClick={handleEmailSubmit}>Load Chat</button>
                </div>

                <div className="chat-messages">
                  {messages.length === 0 && <p>No messages yet.</p>}
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`chat-message ${msg.sender_id === userData.id ? 'self' : 'other'}`}
                    >
                      <div className="message-meta">
                        {msg.sender_id === userData.id ? 'You' : 'Student'}
                        <span className="timestamp">
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="message-content">{msg.message}</div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="chat-input-container">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button onClick={handleSendMessage}>Send</button>
                </div>
              </div>

              <div className="offers-list">
                <h2>Successful Company Offers</h2>
                {offerCompanies.length === 0 ? (
                  <p>No offers yet.</p>
                ) : (
                  <ul>
                    {offerCompanies.map((company, index) => (
                      <li key={index}>{company}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="faq-container">
                <h2>Frequently Asked Questions</h2>

                <div className="faq-item">
                  <h4>How to delete my account?</h4>
                  <p>Go to your profile page, enter your password, and click 'Delete Account'.</p>
                </div>

                <div className="faq-item">
                  <h4>How do I review student job applications?</h4>
                  <p>Navigate to the 'Analytics' page to view and manage job applications.</p>
                </div>
              </div>
            </>
          )}

          {userData.role === 'admin' && (
            <div className="faq-container">
              <h2>Frequently Asked Questions</h2>

              <div className="faq-item">
                <h4>How to delete my account?</h4>
                <p>Go to your profile page, enter your password, and click 'Delete Account'.</p>
              </div>

              <div className="faq-item">
                <h4>How do I manage users?</h4>
                <p>Go to the Admin Dashboard to view and manage users, roles, and permissions.</p>
              </div>
            </div>
          )}
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Help;
