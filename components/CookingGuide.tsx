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

interface Step {
  number: number;
  instruction: string;
  timer?: number;
  tips?: string[];
}

interface CookingGuideProps {
  steps: Step[];
  onStepComplete?: (stepNumber: number) => void;
  onTimerComplete?: (stepNumber: number) => void;
}

export default function CookingGuide({
  steps,
  onStepComplete,
  onTimerComplete,
}: CookingGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStepComplete = (stepNumber: number) => {
    setCompletedSteps((prev) => {
      const newSet = new Set(prev);
      newSet.add(stepNumber);
      return newSet;
    });
    onStepComplete?.(stepNumber);
  };

  const startTimer = (duration: number) => {
    setTimeRemaining(duration);
    setTimerActive(true);
  };

  const stopTimer = () => {
    setTimerActive(false);
  };

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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f3f4f6',
  },
  progressBarContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  progressBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: '#6366f1',
    borderRadius: 4,
  },
  progressBarText: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  stepCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumberContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  stepInstruction: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#2D3748',
    lineHeight: 24,
  },
  tipsContainer: {
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tipsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FF6B6B',
    marginLeft: 8,
    marginBottom: 8,
  },
  tip: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4A5568',
    marginLeft: 8,
    marginBottom: 4,
    flex: 1,
  },
  timerContainer: {
    marginBottom: 16,
  },
  timerButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  timerButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  timerText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  completeButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  completedButton: {
    backgroundColor: '#48BB78',
  },
  completeButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
}); 