// Validate user login
function validateLogin(eid) {
  if (!isValidEidFormat(eid)) {
    return { 
      success: false, 
      message: 'Invalid EID format. EID must be ' + EID_LENGTH + ' digits.' 
    };
  }
  
  const userData = getUserByEid(eid);
  
  if (!userData) {
    return { 
      success: false, 
      message: 'EID not found in the system.' 
    };
  }
  
  // Extract first name from "Last, First" format
  const nameParts = userData.agent_name.split(', ');
  const firstName = nameParts.length > 1 ? nameParts[1] : userData.agent_name;
  
  return {
    success: true,
    user: {
      eid: userData.agent_eid,
      first_name: firstName,
      division: userData.agent_division,
      role: userData.agent_role
    }
  };
}

// Submit signup request
function submitSignupRequest(eid, firstName, lastName, email) {
  if (!isValidEidFormat(eid)) {
    return { 
      success: false, 
      message: 'Invalid EID format. EID must be ' + EID_LENGTH + ' digits.' 
    };
  }
  
  // Check if EID already exists
  const userData = getUserByEid(eid);
  if (userData) {
    return { 
      success: false, 
      message: 'EID already exists in the system.' 
    };
  }
  
  // Validate email domain
  if (!email.endsWith('@' + DOMAIN_NAME)) {
    return { 
      success: false, 
      message: 'Email must be a ' + DOMAIN_NAME + ' address.' 
    };
  }
  
  // Add to pending users
  addPendingUser(eid, firstName, lastName, email);
  
  return {
    success: true,
    message: 'Signup request submitted successfully. You will be notified when approved.'
  };
}

// Get pending user requests (admin only)
function getPendingRequests(eid) {
  if (!isAdmin(eid)) {
    return { 
      success: false, 
      message: 'Unauthorized access.' 
    };
  }
  
  const pendingUsers = getPendingUsers();
  
  return {
    success: true,
    pendingUsers: pendingUsers
  };
}

// Approve or deny pending user (admin only)
function processPendingUser(adminEid, userEid, action) {
  if (!isAdmin(adminEid)) {
    return { 
      success: false, 
      message: 'Unauthorized access.' 
    };
  }
  
  const status = action === 'approve' ? 'approved' : 'denied';
  const result = updatePendingUserStatus(userEid, status);
  
  if (!result) {
    return { 
      success: false, 
      message: 'User not found or already processed.' 
    };
  }
  
  return {
    success: true,
    message: 'User ' + status + ' successfully.'
  };
}