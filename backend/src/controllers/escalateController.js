// @desc    Escalate to emergency contact / alert system
// @route   POST /api/escalate
// @access  Private
const triggerEscalation = async (req, res) => {
  const userId = req.user.id;
  const { reason, location } = req.body;

  try {
    // In a real production system, this would:
    // 1. Send an email to the support team or connected psychologist
    // 2. Trigger an SMS via Twilio to emergency contacts
    // 3. Log the event securely in the database
    
    // For the hackathon, we simulate this by returning success
    console.log(`[EMERGENCY ESCALATION] User ${userId} escalated. Reason: ${reason}, Location: ${location}`);

    res.status(200).json({ 
      message: 'Escalation triggered successfully. Help is on the way.',
      escalation_id: `ESC-${Date.now()}`
    });
  } catch (error) {
    console.error('Error triggering escalation:', error);
    res.status(500).json({ error: 'Server error triggering escalation' });
  }
};

// @desc    Get emergency resources
// @route   GET /api/escalate/resources/emergency
// @access  Public
const getEmergencyResources = (req, res) => {
  const resources = [
    {
      country: 'Global',
      name: 'Crisis Text Line',
      contact: 'Text HOME to 741741',
      type: 'Text'
    },
    {
      country: 'USA',
      name: 'National Suicide Prevention Lifeline',
      contact: '988',
      type: 'Phone'
    },
    {
      country: 'UK',
      name: 'Samaritans',
      contact: '116 123',
      type: 'Phone'
    },
    // Add local lines depending on the hackathon's target region
    {
      country: 'Rwanda', // (Assuming Rwanda due to 'Humura', a common Kinyarwanda word meaning 'be comforted')
      name: 'Ndera Neuropsychiatric Hospital Hotline',
      contact: '114',
      type: 'Phone'
    }
  ];

  res.json(resources);
};

module.exports = {
  triggerEscalation,
  getEmergencyResources,
};
