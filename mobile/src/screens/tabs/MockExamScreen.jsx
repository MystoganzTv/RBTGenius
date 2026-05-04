import { useState, useEffect, useRef } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import * as Haptics from 'expo-haptics';

import { alpha, getTheme } from '../../theme';
import { getMockExamQuestions } from '../../services/questionService.js';
import { useAuth } from '../../context/AuthContext';

const EXAM_SIZE = 85;
const TIME_LIMIT = 90 * 60; // 90 minutes in seconds
const PASS_SCORE = 80;

export default function MockExamScreen({ navigation }) {
  const scheme = useColorScheme();
  const theme = getTheme(scheme === 'dark' ? 'dark' : 'light');
  const { user } = useAuth();
  const s = styles(theme);
  const isPro = user?.plan === 'premium' || user?.plan === 'premium_monthly' || user?.plan === 'premium_yearly';

  const [phase, setPhase] = useState('setup'); // setup | running | results
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const timerRef = useRef(null);

  const startExam = () => {
    const qs = getMockExamQuestions(EXAM_SIZE);
    setQuestions(qs);
    setIndex(0);
    setAnswers({});
    setSelected(null);
    setTimeLeft(TIME_LIMIT);
    setPhase('running');
  };

  useEffect(() => {
    if (phase !== 'running') return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setPhase('results');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const fmt = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s2 = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s2}`;
  };

  const choose = (i) => {
    if (selected !== null) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected(i);
    setAnswers((prev) => ({ ...prev, [index]: i }));
  };

  const next = () => {
    if (index < questions.length - 1) {
      setIndex((i) => i + 1);
      setSelected(answers[index + 1] ?? null);
    } else {
      clearInterval(timerRef.current);
      setPhase('results');
    }
  };

  const prev = () => {
    if (index > 0) {
      setIndex((i) => i - 1);
      setSelected(answers[index - 1] ?? null);
    }
  };

  const submitEarly = () => {
    const cnt = Object.keys(answers).length;
    Alert.alert(
      'Submit exam?',
      `You have answered ${cnt} of ${questions.length} questions.`,
      [
        { text: 'Keep going', style: 'cancel' },
        {
          text: 'Submit',
          style: 'destructive',
          onPress: () => {
            clearInterval(timerRef.current);
            setPhase('results');
          },
        },
      ]
    );
  };

  // ─── Results ──────────────────────────────────────────────────────────────
  if (phase === 'results') {
    const total = questions.length;
    const correct = questions.filter((q, i) => answers[i] === q.correctIndex).length;
    const pct = Math.round((correct / total) * 100);
    const passed = pct >= PASS_SCORE;

    return (
      <SafeAreaView style={s.safe} edges={['top']}>
        <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
          <View style={[s.resultHeader, { backgroundColor: passed ? alpha(theme.success, 0.1) : alpha('#EF4444', 0.08) }]}>
            <Text style={s.resultEmoji}>{passed ? '🎉' : '📚'}</Text>
            <Text style={[s.resultScore, { color: passed ? theme.success : '#EF4444' }]}>{pct}%</Text>
            <Text style={s.resultStatus}>{passed ? 'PASSED' : 'NOT PASSED'}</Text>
            <Text style={s.resultDetail}>{correct} / {total} correct · {PASS_SCORE}% required to pass</Text>
          </View>

          <View style={s.reviewCard}>
            {questions.map((q, i) => {
              const ans = answers[i];
              const isCorrect = ans === q.correctIndex;
              const answered = ans !== undefined;
              return (
                <View
                  key={i}
                  style={[
                    s.reviewRow,
                    i < questions.length - 1 && { borderBottomColor: alpha(theme.border, 0.6), borderBottomWidth: 1 },
                  ]}
                >
                  <Text style={s.reviewNum}>Q{i + 1}</Text>
                  <Text style={[s.reviewResult, { color: !answered ? theme.muted : isCorrect ? theme.success : '#EF4444' }]}>
                    {!answered ? '—' : isCorrect ? '✓' : '✗'}
                  </Text>
                </View>
              );
            })}
          </View>

          <Pressable style={s.retakeBtn} onPress={() => setPhase('setup')}>
            <Text style={s.retakeBtnText}>Retake Exam</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── Setup ────────────────────────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <SafeAreaView style={s.safe} edges={['top']}>
        <View style={s.topBar}>
          <Text style={s.screenTitle}>Mock Exam</Text>
          <Text style={s.screenSub}>Full-length BACB RBT simulation</Text>
        </View>

        <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
          <View style={s.infoCard}>
            <Text style={s.infoTitle}>Exam Overview</Text>
            <View style={s.infoRow}><Text style={s.infoLabel}>Questions</Text><Text style={s.infoVal}>{EXAM_SIZE}</Text></View>
            <View style={s.infoRow}><Text style={s.infoLabel}>Time limit</Text><Text style={s.infoVal}>90 minutes</Text></View>
            <View style={s.infoRow}><Text style={s.infoLabel}>Passing score</Text><Text style={s.infoVal}>{PASS_SCORE}%</Text></View>
            <View style={[s.infoRow, { borderBottomWidth: 0 }]}><Text style={s.infoLabel}>Format</Text><Text style={s.infoVal}>Multiple choice</Text></View>
          </View>

          <View style={s.tipsCard}>
            <Text style={s.tipsTitle}>Tips</Text>
            <Text style={s.tipText}>• Read each question carefully before selecting an answer.</Text>
            <Text style={s.tipText}>• You can go back and change answers at any time.</Text>
            <Text style={s.tipText}>• Skip tough questions and come back to them.</Text>
            <Text style={s.tipText}>• Aim to finish with at least 10 minutes to review.</Text>
          </View>

          {isPro ? (
            <Pressable style={s.startBtn} onPress={startExam}>
              <Text style={s.startBtnText}>Start Exam</Text>
            </Pressable>
          ) : (
            <View style={s.lockedWrap}>
              <Text style={s.lockedEmoji}>🔒</Text>
              <Text style={s.lockedTitle}>Pro Feature</Text>
              <Text style={s.lockedSub}>Mock exams are available on the Pro plan.</Text>
              <Pressable
                style={s.upgradeBtn}
                onPress={() => navigation.navigate('Upgrade')}
              >
                <Text style={s.upgradeBtnText}>Upgrade to Pro</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── Running ──────────────────────────────────────────────────────────────
  const q = questions[index];
  const answered = Object.keys(answers).length;
  const timerWarning = timeLeft <= 600;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.topBar}>
        <View style={s.topBarRow}>
          <Text style={s.screenTitle}>{index + 1} / {questions.length}</Text>
          <Text style={[s.timer, timerWarning && { color: '#EF4444' }]}>{fmt(timeLeft)}</Text>
        </View>
        <Text style={s.screenSub}>{answered} answered · {questions.length - answered} remaining</Text>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.qCard}>
          <Text style={s.qDomain}>{q.topicLabel}</Text>
          <Text style={s.qText}>{q.prompt}</Text>
        </View>

        <View style={s.optionsWrap}>
          {(q.options).map((opt, i) => {
            const isSelected = selected === i;
            return (
              <Pressable
                key={i}
                onPress={() => choose(i)}
                style={[
                  s.optionBtn,
                  isSelected && { backgroundColor: alpha(theme.primary, 0.1), borderColor: theme.primary },
                ]}
              >
                <View style={[s.optionBullet, isSelected && { backgroundColor: theme.primary }]}>
                  <Text style={[s.optionLetter, isSelected && { color: '#fff' }]}>
                    {['A','B','C','D'][i]}
                  </Text>
                </View>
                <Text style={[s.optionText, isSelected && { color: theme.primary }]}>{opt}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={s.navRow}>
          <Pressable style={s.navBtn} onPress={prev} disabled={index === 0}>
            <Text style={[s.navBtnText, index === 0 && { color: theme.muted }]}>← Prev</Text>
          </Pressable>
          <Pressable style={[s.navBtn, s.navBtnPrimary]} onPress={next}>
            <Text style={[s.navBtnText, { color: '#fff' }]}>
              {index < questions.length - 1 ? 'Next →' : 'Finish'}
            </Text>
          </Pressable>
        </View>

        <Pressable style={s.submitEarly} onPress={submitEarly}>
          <Text style={s.submitEarlyText}>Submit Exam</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = (theme) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.background },
    topBar: { paddingHorizontal: 20, paddingVertical: 14, borderBottomColor: alpha(theme.border, 0.6), borderBottomWidth: 1 },
    topBarRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    screenTitle: { color: theme.text, fontSize: 18, fontWeight: '800' },
    screenSub: { color: theme.muted, fontSize: 12, marginTop: 2 },
    timer: { color: theme.primary, fontSize: 18, fontWeight: '800', fontVariant: ['tabular-nums'] },
    content: { padding: 20, gap: 16, paddingBottom: 40 },
    infoCard: { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1, borderRadius: 24, padding: 20, gap: 0 },
    infoTitle: { color: theme.text, fontSize: 16, fontWeight: '800', marginBottom: 14 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomColor: alpha(theme.border, 0.6), borderBottomWidth: 1 },
    infoLabel: { color: theme.muted, fontSize: 14 },
    infoVal: { color: theme.text, fontSize: 14, fontWeight: '700' },
    tipsCard: { backgroundColor: alpha(theme.primary, 0.06), borderRadius: 20, padding: 20, gap: 8 },
    tipsTitle: { color: theme.text, fontSize: 15, fontWeight: '800', marginBottom: 4 },
    tipText: { color: theme.muted, fontSize: 13, lineHeight: 20 },
    startBtn: { backgroundColor: theme.primary, borderRadius: 18, paddingVertical: 18, alignItems: 'center' },
    startBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
    qCard: { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1, borderRadius: 24, padding: 22, gap: 10, shadowColor: theme.shadow, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.07, shadowRadius: 18 },
    qDomain: { color: theme.primary, fontSize: 11, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase' },
    qText: { color: theme.text, fontSize: 17, fontWeight: '700', lineHeight: 26 },
    optionsWrap: { gap: 10 },
    optionBtn: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1.5, borderRadius: 18, padding: 16 },
    optionBullet: { width: 32, height: 32, borderRadius: 10, backgroundColor: alpha(theme.primary, 0.1), alignItems: 'center', justifyContent: 'center' },
    optionLetter: { color: theme.primary, fontSize: 13, fontWeight: '800' },
    optionText: { flex: 1, color: theme.text, fontSize: 15, lineHeight: 22 },
    navRow: { flexDirection: 'row', gap: 12 },
    navBtn: { flex: 1, borderRadius: 16, paddingVertical: 16, alignItems: 'center', backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 },
    navBtnPrimary: { backgroundColor: theme.primary, borderColor: theme.primary },
    navBtnText: { color: theme.text, fontSize: 15, fontWeight: '700' },
    submitEarly: { borderColor: '#EF4444', borderWidth: 1, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
    submitEarlyText: { color: '#EF4444', fontSize: 14, fontWeight: '700' },
    lockedWrap: {
      backgroundColor: '#FFF7E6', borderColor: '#FFB80033', borderWidth: 1,
      borderRadius: 22, padding: 28, alignItems: 'center', gap: 10,
    },
    lockedEmoji: { fontSize: 36 },
    lockedTitle: { fontSize: 18, fontWeight: '900', color: '#92400E' },
    lockedSub: { fontSize: 14, color: '#78350F', textAlign: 'center', lineHeight: 20 },
    upgradeBtn: {
      backgroundColor: '#FFB800', borderRadius: 16,
      paddingVertical: 14, paddingHorizontal: 28, marginTop: 4,
    },
    upgradeBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
    resultHeader: { borderRadius: 28, padding: 32, alignItems: 'center', gap: 8 },
    resultEmoji: { fontSize: 52 },
    resultScore: { fontSize: 60, fontWeight: '900' },
    resultStatus: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
    resultDetail: { color: '#64748B', fontSize: 14, textAlign: 'center' },
    reviewCard: { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1, borderRadius: 24, overflow: 'hidden' },
    reviewRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 10 },
    reviewNum: { color: theme.muted, fontSize: 13, fontWeight: '600' },
    reviewResult: { fontSize: 16, fontWeight: '800' },
    retakeBtn: { backgroundColor: theme.primary, borderRadius: 18, paddingVertical: 18, alignItems: 'center' },
    retakeBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  });
