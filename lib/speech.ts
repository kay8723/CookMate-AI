import * as Speech from 'expo-speech';
import { Platform } from 'react-native';
import { Camera } from 'expo-camera';

export class SpeechService {
  private static isListening = false;
  private static recognitionTimeout: NodeJS.Timeout | null = null;

  static async requestPermissions() {
    try {
      // Use the Camera module to request microphone permissions
      // This is the recommended approach instead of the deprecated Permissions API
      const { status: micStatus } = await Camera.requestMicrophonePermissionsAsync();
      
      // Speech recognition permissions are handled by the OS
      // We'll assume they're granted if microphone is granted
      return micStatus === 'granted';
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }

  static async speak(text: string, options: Speech.SpeechOptions = {}) {
    try {
      await Speech.speak(text, {
        language: 'en',
        pitch: 1.0,
        rate: 0.9,
        ...options,
      });
    } catch (error) {
      console.error('Error speaking text:', error);
      throw error;
    }
  }

  // Note: Expo Speech doesn't have built-in speech recognition
  // This is a placeholder implementation that would need to be replaced
  // with a proper speech recognition library in a production app
  static async startListening(
    onResult: (text: string) => void,
    onError?: (error: Error) => void,
    timeout = 10000
  ) {
    try {
      if (this.isListening) {
        throw new Error('Speech recognition is already active');
      }

      // Set the flag before starting recognition
      this.isListening = true;
      
      console.warn('Speech recognition not fully implemented');
      console.warn('In a production app, you would use a library like react-native-voice');
      
      // Mock implementation for development
      // In a real app, you would integrate with a speech recognition library
      setTimeout(() => {
        if (this.isListening) {
          onResult('This is a simulated voice recognition result');
        }
      }, 2000);

      // Set timeout to stop listening
      this.recognitionTimeout = setTimeout(() => {
        this.stopListening();
      }, timeout) as unknown as NodeJS.Timeout;
      
    } catch (error) {
      this.isListening = false;
      onError?.(error as Error);
      throw error;
    }
  }

  static async stopListening() {
    try {
      if (!this.isListening) return;

      // Just reset the flag since we don't have actual recognition running
      this.isListening = false;

      if (this.recognitionTimeout) {
        clearTimeout(this.recognitionTimeout);
        this.recognitionTimeout = null;
      }
      
      console.warn('Speech recognition stopped (mock implementation)');
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
      throw error;
    }
  }

  static async processVoiceCommand(
    command: string,
    context: {
      currentRecipe?: string;
      currentStep?: number;
      availableIngredients?: string[];
    }
  ): Promise<{
    action: string;
    parameters: Record<string, any>;
  }> {
    try {
      // Normalize command
      const normalizedCommand = command.toLowerCase().trim();

      // Define command patterns
      const patterns = [
        {
          regex: /next step|continue|proceed/i,
          action: 'nextStep',
          parameters: {},
        },
        {
          regex: /previous step|go back|back/i,
          action: 'previousStep',
          parameters: {},
        },
        {
          regex: /start timer|set timer|timer/i,
          action: 'startTimer',
          parameters: {},
        },
        {
          regex: /stop timer|pause timer/i,
          action: 'stopTimer',
          parameters: {},
        },
        {
          regex: /how long|time left|remaining/i,
          action: 'getTimeRemaining',
          parameters: {},
        },
        {
          regex: /what's next|next instruction/i,
          action: 'getNextInstruction',
          parameters: {},
        },
        {
          regex: /repeat|say again/i,
          action: 'repeatInstruction',
          parameters: {},
        },
        {
          regex: /substitute|replace|alternative for ([\w\s]+)/i,
          action: 'getSubstitution',
          parameters: {
            ingredient: normalizedCommand.match(/alternative for ([\w\s]+)/i)?.[1] || 
                       normalizedCommand.match(/substitute ([\w\s]+)/i)?.[1] || 
                       normalizedCommand.match(/replace ([\w\s]+)/i)?.[1],
          },
        },
        {
          regex: /help|what can i say/i,
          action: 'getHelp',
          parameters: {},
        },
      ];

      // Find matching pattern
      const match = patterns.find((pattern) => pattern.regex.test(normalizedCommand));

      if (!match) {
        throw new Error('Command not recognized');
      }

      return {
        action: match.action,
        parameters: match.parameters,
      };
    } catch (error) {
      console.error('Error processing voice command:', error);
      throw error;
    }
  }

  static getAvailableCommands(): string[] {
    return [
      'Next step',
      'Previous step',
      'Start timer',
      'Stop timer',
      'How long?',
      "What's next?",
      'Repeat',
      'Substitute [ingredient]',
      'Help',
    ];
  }
}
