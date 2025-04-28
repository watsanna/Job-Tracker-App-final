import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import './sync-platforms.css';

const SyncPlatforms = () => {
  const [userData, setUserData] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [isConnected, setIsConnected] = useState({
    linkedin: false,
    handshake: false,
    indeed: false,
    glassdoor: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        // Try getting from session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session || !session.user || !session.user.email) {
          setError('User not authenticated. Please log in.');
          return;
        }
        localStorage.setItem('userEmail', session.user.email);
      }

      const email = localStorage.getItem('userEmail');
      
      const { data, error: userError } = await supabase
        .from('usersData')
        .select('id, connected_platforms')
        .eq('email', email)
        .single();

      if (userError) {
        console.error('Error fetching user data:', userError.message);
        setError(`Failed to fetch user data: ${userError.message}`);
        return;
      }

      if (!data) {
        setError('User data not found.');
        return;
      }

      setUserData(data);
      
      // Update connected platforms if available
      if (data.connected_platforms) {
        const platforms = Array.isArray(data.connected_platforms) 
          ? data.connected_platforms 
          : [];
          
        setIsConnected({
          linkedin: platforms.includes('linkedin'),
          handshake: platforms.includes('handshake'),
          indeed: platforms.includes('indeed'),
          glassdoor: platforms.includes('glassdoor')
        });
      }
    } catch (err) {
      console.error('Error in fetchUserData:', err);
      setError(err.message);
    }
  };

  const handlePlatformChange = (e) => {
    setSelectedPlatform(e.target.value);
  };

  const connectPlatform = async () => {
    if (!selectedPlatform || !userData) {
      setError('No platform selected or user data not available.');
      return;
    }
    
    setIsLoading(true);
    setMessage('');
    setError('');

    // Simulate API call for connecting to platform
    setTimeout(async () => {
      try {
        // Get current connected platforms
        const currentConnected = userData.connected_platforms || [];
        const updatedConnected = Array.isArray(currentConnected) 
          ? [...currentConnected] 
          : [];
        
        // Add selected platform if not already connected
        if (!updatedConnected.includes(selectedPlatform)) {
          updatedConnected.push(selectedPlatform);
        }
        
        // Update database
        const { error: updateError } = await supabase
          .from('usersData')
          .update({ connected_platforms: updatedConnected })
          .eq('id', userData.id);
        
        if (updateError) throw new Error(`Database update failed: ${updateError.message}`);
        
        // Update local state
        setIsConnected({
          ...isConnected,
          [selectedPlatform]: true
        });
        
        setMessage(`Successfully connected to ${selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)}!`);
      } catch (err) {
        console.error('Error connecting platform:', err.message);
        setError(`Failed to connect: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  };

  const disconnectPlatform = async (platform) => {
    if (!userData) {
      setError('User data not available.');
      return;
    }
    
    setIsLoading(true);
    setMessage('');
    setError('');

    // Simulate API call for disconnecting from platform
    setTimeout(async () => {
      try {
        // Get current connected platforms
        const currentConnected = userData.connected_platforms || [];
        const updatedConnected = Array.isArray(currentConnected)
          ? currentConnected.filter(p => p !== platform)
          : [];
        
        // Update database
        const { error: updateError } = await supabase
          .from('usersData')
          .update({ connected_platforms: updatedConnected })
          .eq('id', userData.id);
        
        if (updateError) throw new Error(`Database update failed: ${updateError.message}`);
        
        // Update local state
        setIsConnected({
          ...isConnected,
          [platform]: false
        });
        
        setMessage(`Successfully disconnected from ${platform.charAt(0).toUpperCase() + platform.slice(1)}.`);
      } catch (err) {
        console.error('Error disconnecting platform:', err.message);
        setError(`Failed to disconnect: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  };

  const handleImportJobs = async (platform) => {
    setIsLoading(true);
    setMessage('');
    setError('');

    // Simulate importing jobs
    setTimeout(() => {
      setMessage(`Successfully imported jobs from ${platform.charAt(0).toUpperCase() + platform.slice(1)}!`);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="sync-platforms-container">
      <h1>Sync External Platforms</h1>
      <p className="description">Connect your external job application platforms to import and track all your job applications in one place.</p>
      
      {error && <div className="message" style={{backgroundColor: '#dc3545'}}>{error}</div>}
      
      <div className="connect-section">
        <h2>Connect a New Platform</h2>
        <div className="platform-select">
          <select value={selectedPlatform} onChange={handlePlatformChange}>
            <option value="">Select a platform</option>
            <option value="linkedin">LinkedIn</option>
            <option value="handshake">Handshake</option>
            <option value="indeed">Indeed</option>
            <option value="glassdoor">Glassdoor</option>
          </select>
          <button 
            onClick={connectPlatform} 
            disabled={!selectedPlatform || isLoading}
            className="connect-button"
          >
            {isLoading ? 'Connecting...' : 'Connect'}
          </button>
        </div>
      </div>

      <div className="connected-platforms">
        <h2>Connected Platforms</h2>
        {Object.entries(isConnected).some(([_, value]) => value) ? (
          <div className="platform-list">
            {Object.entries(isConnected).map(([platform, connected]) => (
              connected && (
                <div key={platform} className="platform-item">
                  <div className="platform-info">
                    <h3>{platform.charAt(0).toUpperCase() + platform.slice(1)}</h3>
                    <div className="platform-actions">
                      <button 
                        onClick={() => handleImportJobs(platform)}
                        className="import-button"
                        disabled={isLoading}
                      >
                        Import Jobs
                      </button>
                      <button 
                        onClick={() => disconnectPlatform(platform)}
                        className="disconnect-button"
                        disabled={isLoading}
                      >
                        Disconnect
                      </button>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        ) : (
          <p className="no-connected">No platforms connected yet.</p>
        )}
      </div>

      {message && <div className="message">{message}</div>}

      <button onClick={() => navigate('/profile')} className="back-button">
        Back to Profile
      </button>
    </div>
  );
};

export default SyncPlatforms;