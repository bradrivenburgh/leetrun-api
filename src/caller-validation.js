    //Example caller object for ValidationService
    
    // Define invalid values for caller's required properties;
    // pass this to ValidationService
    const requiredDictionary = {
      id: (value) => {
        if (!value) { 
          return false;
        }
      },
      date: (value) => {
        if (!value) {
          return false;
        }
      },
      location: (value) => {
        if (!value) {
          return false;
        }
      },
      distance: (value) => {
        if (!value) {
          return false;
        }
      },
      hours: (value) => {
        if (!value) {
          return false;
        }
      },
      minutes: (value) => {
        if (!value) {
          return false;
        }
      },
      seconds: (value) => {
        if (!value) {
          return false;
        }
      },
    };

    // Custom validation messages here
    const customInvalidPropsMessages = {
      rating: 'Invalid property provided: rating -- must be a number between 0 and 5',
    };

    module.exports = {
      requiredDictionary,
      customInvalidPropsMessages
    };