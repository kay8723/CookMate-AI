import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { Clock, Timer, CheckCircle2, AlertCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, typography } from '../../theme';

// Types
export interface Step {
  number: number;
  instruction: string;
  timer?: number;
  tips?: string[];
}

export interface CookingGuideProps {
  steps: Step[];
  onStepComplete?: (stepNumber: number) => void;
  onTimerComplete?: (stepNumber: number) => void;
}

// Component
export const CookingGuide: React.FC<CookingGuideProps> = ({
  steps,
  onStepComplete,
  onTimerComplete,
}) => {
  // State
  const [currentStep, setCurrentStep] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  // Effects
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            onTimerComplete?.(currentStep);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeRemaining, currentStep, onTimerComplete]);

  // Helpers
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStepComplete = (stepNumber: number): void => {
    setCompletedSteps((prev) => {
      const newSet = new Set(prev);
      newSet.add(stepNumber);
      return newSet;
    });
    onStepComplete?.(stepNumber);
  };

  const startTimer = (duration: number): void => {
    setTimeRemaining(duration);
    setTimerActive(true);
  };

  const stopTimer = (): void => {
    setTimerActive(false);
  };

  // Render
  return (
    <Animated.ScrollView
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${(completedSteps.size / steps.length) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressBarText}>
          {completedSteps.size} / {steps.length} steps completed
        </Text>
      </View>

      {steps.map((step, index) => {
        const completed = completedSteps.has(step.number);
        return (
          <Animated.View
            key={step.number}
            style={[
              styles.stepCard,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim },
                ],
              },
            ]}
          >
            <View style={styles.stepHeader}>
              <View style={styles.stepNumberCircle}>
                <Text style={styles.stepNumber}>{step.number}</Text>
              </View>
              <Text style={styles.stepInstruction}>{step.instruction}</Text>
            </View>

            {step.tips && step.tips.length > 0 && (
              <View style={styles.tipBox}>
                <AlertCircle size={18} color="#f59e42" style={{ marginRight: 8 }} />
                <View>
                  {step.tips.map((tip, tipIndex) => (
                    <Text key={tipIndex} style={styles.tipText}>
                      {tip}
                    </Text>
                  ))}
                </View>
              </View>
            )}

            {step.timer && (
              <View style={styles.timerContainer}>
                <TouchableOpacity
                  onPress={() =>
                    timerActive ? stopTimer() : startTimer(step.timer!)
                  }
                  activeOpacity={0.85}
                  style={[styles.timerButton, timerActive && styles.timerButtonActive]}
                >
                  <Timer size={22} color="#fff" />
                  <Text style={styles.timerText}>
                    {timerActive && currentStep === index
                      ? formatTime(timeRemaining)
                      : `${step.timer} sec`}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.completeButton,
                completed && styles.completedButton,
              ]}
              onPress={() => handleStepComplete(step.number)}
              disabled={completed}
              activeOpacity={0.85}
            >
              {completed ? (
                <CheckCircle2 size={22} color="#fff" />
              ) : (
                <Text style={styles.completeButtonText}>Mark Complete</Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
    backgroundColor: colors.background.default,
  },
  progressBarContainer: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  progressBarBackground: {
    width: '100%',
    height: spacing.sm,
    backgroundColor: colors.grey[200],
    borderRadius: borderRadius.xs,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressBarFill: {
    height: spacing.sm,
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.xs,
  },
  progressBarText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  stepCard: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    shadowColor: colors.grey[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: spacing.sm,
    elevation: 4,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  stepNumberCircle: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  stepNumber: {
    color: colors.background.paper,
    ...typography.button,
  },
  stepInstruction: {
    flex: 1,
    ...typography.body1,
    color: colors.text.primary,
  },
  tipBox: {
    flexDirection: 'row',
    backgroundColor: colors.warning.light + '20',
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.lg,
  },
  tipText: {
    color: colors.warning.dark,
    ...typography.body2,
  },
  timerContainer: {
    marginBottom: spacing.lg,
  },
  timerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.main,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
  },
  timerButtonActive: {
    backgroundColor: colors.primary.dark,
  },
  timerText: {
    color: colors.background.paper,
    ...typography.button,
    marginLeft: spacing.sm,
  },
  completeButton: {
    backgroundColor: colors.primary.main,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
  },
  completedButton: {
    backgroundColor: colors.success.main,
  },
  completeButtonText: {
    color: colors.background.paper,
    ...typography.button,
  },
}); 