import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';

import { alpha, getTheme } from '../../theme';
import { ProgressBar, SectionTitle, toneColor } from '../../components/ui';
import { buildDomainStats, TOTAL_PRACTICE_QUESTIONS } from '../../services/questionService.js';
import { useAuth } from '../../context/AuthContext';

const domainStats = buildDomainStats();

// Static weekly data — replace with real API data when available
const WEEKLY = [
  { day: 'Mon', score: 72, highlight: false },
  { day: 'Tue', score: 85, highlight: false },
  { day: 'Wed', score: 78, highlight: false },
  { day: 'Thu', score: 91, highlight: true },
  { day: 'Fri', score: 88, highlight: false },
  { day: 'Sat', score: 76, highlight: false },
  { day: 'Sun', score: 84, highlight: false },
];

export default function AnalyticsScreen() {
  const scheme = useColorScheme();
  const theme = getTheme(scheme === 'dark' ? 'dark' : 'light');
  const { user } = useAuth();
  const s = styles(theme);

  const completed = user?.completedQuestions ?? 0;
  const readiness = user?.readiness ?? 0;
  const streak = user?.streak ?? 0;
  const avg = Math.round(WEEKLY.reduce((sum, d) => sum + d.score, 0) / WEEKLY.length);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.topBar}>
        <Text style={s.screenTitle}>Analytics</Text>
        <Text style={s.screenSub}>Your performance over time</Text>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Summary chips */}
        <View style={s.statRow}>
          <View style={s.statChip}>
            <Text style={s.statValue}>{completed.toLocaleString()}</Text>
            <Text style={s.statLabel}>Questions Done</Text>
          </View>
          <View style={s.statChip}>
            <Text style={[s.statValue, { color: theme.primary }]}>{readiness}%</Text>
            <Text style={s.statLabel}>Readiness</Text>
          </View>
          <View style={s.statChip}>
            <Text style={[s.statValue, { color: theme.gold }]}>{streak}</Text>
            <Text style={s.statLabel}>Day Streak</Text>
          </View>
        </View>

        {/* Weekly chart */}
        <SectionTitle title="Weekly Accuracy" subtitle="Last 7 days" theme={theme} />
        <View style={s.chartCard}>
          <View style={s.chart}>
            {WEEKLY.map((day) => (
              <View key={day.day} style={s.chartCol}>
                <Text style={s.chartScore}>{day.score}%</Text>
                <View style={s.chartTrack}>
                  <View
                    style={[
                      s.chartFill,
                      {
                        height: `${day.score}%`,
                        backgroundColor: day.highlight ? theme.gold : theme.primary,
                      },
                    ]}
                  />
                </View>
                <Text style={s.chartDay}>{day.day}</Text>
              </View>
            ))}
          </View>
          <Text style={s.chartAvg}>7-day avg: {avg}%</Text>
        </View>

        {/* Domain breakdown */}
        <SectionTitle title="Domain Breakdown" subtitle="Where you stand across all 6 areas" theme={theme} />
        <View style={s.panel}>
          {domainStats.map((d) => (
            <View key={d.key} style={s.domainRow}>
              <View style={s.domainMeta}>
                <Text style={s.domainLabel}>{d.label}</Text>
                <Text style={[s.domainPct, { color: toneColor(d.accent, theme) }]}>{d.mastery}%</Text>
              </View>
              <ProgressBar color={toneColor(d.accent, theme)} progress={d.mastery} theme={theme} />
              <Text style={s.domainRec}>{d.recommendation}</Text>
            </View>
          ))}
        </View>

        {/* Bank stats */}
        <View style={s.bankCard}>
          <Text style={s.bankTitle}>Question Bank</Text>
          <Text style={s.bankStat}>{TOTAL_PRACTICE_QUESTIONS.toLocaleString()} practice questions</Text>
          <Text style={s.bankSub}>Covering all 43 BACB RBT TCO 3rd Edition task list items</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = (theme: ReturnType<typeof getTheme>) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.background },
    topBar: {
      paddingHorizontal: 20, paddingVertical: 14,
      borderBottomColor: alpha(theme.border, 0.6), borderBottomWidth: 1,
    },
    screenTitle: { color: theme.text, fontSize: 18, fontWeight: '800' },
    screenSub: { color: theme.muted, fontSize: 12, marginTop: 2 },
    content: { padding: 20, gap: 20, paddingBottom: 40 },
    statRow: { flexDirection: 'row', gap: 12 },
    statChip: {
      flex: 1, backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1,
      borderRadius: 20, padding: 16, alignItems: 'center', gap: 4,
    },
    statValue: { color: theme.text, fontSize: 22, fontWeight: '900' },
    statLabel: { color: theme.muted, fontSize: 12, fontWeight: '600', textAlign: 'center' },
    chartCard: {
      backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1,
      borderRadius: 24, padding: 20, gap: 12,
      shadowColor: theme.shadow, shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.07, shadowRadius: 20,
    },
    chart: {
      flexDirection: 'row', alignItems: 'flex-end',
      height: 180, gap: 8,
    },
    chartCol: { flex: 1, alignItems: 'center', gap: 6, height: '100%' },
    chartScore: { color: theme.muted, fontSize: 10, fontWeight: '700' },
    chartTrack: {
      flex: 1, width: 22, backgroundColor: alpha(theme.primary, 0.08),
      borderRadius: 999, overflow: 'hidden', justifyContent: 'flex-end',
    },
    chartFill: { width: '100%', borderRadius: 999 },
    chartDay: { color: theme.muted, fontSize: 11, fontWeight: '700' },
    chartAvg: { color: theme.muted, fontSize: 13, fontWeight: '600', textAlign: 'right' },
    panel: {
      backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1,
      borderRadius: 24, padding: 20, gap: 18,
    },
    domainRow: { gap: 6 },
    domainMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    domainLabel: { color: theme.text, fontSize: 15, fontWeight: '700' },
    domainPct: { fontSize: 14, fontWeight: '800' },
    domainRec: { color: theme.muted, fontSize: 12, lineHeight: 18 },
    bankCard: {
      backgroundColor: alpha(theme.primary, 0.07), borderRadius: 20,
      padding: 20, gap: 4,
    },
    bankTitle: { color: theme.text, fontSize: 16, fontWeight: '800' },
    bankStat: { color: theme.primary, fontSize: 22, fontWeight: '900' },
    bankSub: { color: theme.muted, fontSize: 13, lineHeight: 20 },
  });
