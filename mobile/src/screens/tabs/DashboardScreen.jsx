import { ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { alpha, getTheme } from '../../theme';
import { Badge, MetricCard, ProgressBar, SectionTitle, toneColor } from '../../components/ui';
import { buildDomainStats, TOTAL_PRACTICE_QUESTIONS } from '../../services/questionService.js';

const domainStats = buildDomainStats();

export default function DashboardScreen() {
  const scheme = useColorScheme();
  const theme = getTheme(scheme === 'dark' ? 'dark' : 'light');
  const { user } = useAuth();
  const s = styles(theme);
  const firstName = user?.name?.split(' ')[0] ?? 'Student';
  const readiness = user?.readiness ?? 84;
  const streak = user?.streak ?? 0;
  const completed = user?.completedQuestions ?? 0;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.topBar}>
        <View style={s.brand}>
          <View style={s.brandMark}><Text style={s.brandInitials}>RG</Text></View>
          <View><Text style={s.screenTitle}>Dashboard</Text><Text style={s.screenSub}>Your exam readiness</Text></View>
        </View>
      </View>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.heroCard}>
          <View style={[s.orb, s.orbTop, {backgroundColor:alpha(theme.gold,0.16)}]}/>
          <View style={[s.orb, s.orbBottom, {backgroundColor:alpha(theme.primary,0.18)}]}/>
          <Text style={s.eyebrow}>RBT Genius</Text>
          <Text style={s.heroTitle}>Welcome back, {firstName}</Text>
          <Text style={s.heroBody}>Exam Readiness at {readiness}% based on your latest practice.</Text>
          <View style={s.badgeRow}>
            <Badge label={`${streak} day streak`} theme={theme} />
            <Badge label={user?.plan ?? 'Free Plan'} tone="gold" theme={theme} />
          </View>
        </View>
        <SectionTitle title="Daily Snapshot" subtitle="Your progress at a glance" theme={theme} />
        <View style={s.metricGrid}>
          <MetricCard accent="primary" label="Questions Done" value={completed.toLocaleString()} theme={theme} />
          <MetricCard accent="gold" label="Readiness" value={`${readiness}%`} theme={theme} />
          <MetricCard accent="success" label="Study Streak" value={`${streak} days`} theme={theme} />
          <MetricCard accent="primary" label="Bank Size" value={TOTAL_PRACTICE_QUESTIONS.toLocaleString()} theme={theme} />
        </View>
        <SectionTitle title="Domain Mastery" subtitle="Based on your practice by content area" theme={theme} />
        <View style={s.panel}>
          {domainStats.map(domain => (
            <View key={domain.key} style={s.domainRow}>
              <View style={s.domainHeader}>
                <Text style={s.domainLabel}>{domain.label}</Text>
                <Text style={s.domainStatus}>{domain.status}</Text>
              </View>
              <Text style={s.domainPercent}>{domain.mastery}%</Text>
              <ProgressBar color={toneColor(domain.accent, theme)} progress={domain.mastery} theme={theme} />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = (theme) => StyleSheet.create({
  safe:{flex:1,backgroundColor:theme.background},
  topBar:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,paddingVertical:14,borderBottomColor:alpha(theme.border,0.6),borderBottomWidth:1},
  brand:{flexDirection:'row',alignItems:'center',gap:14},
  brandMark:{width:42,height:42,borderRadius:16,backgroundColor:theme.primary,alignItems:'center',justifyContent:'center',shadowColor:theme.primary,shadowOffset:{width:0,height:8},shadowOpacity:0.25,shadowRadius:14},
  brandInitials:{color:'#fff',fontSize:14,fontWeight:'800'},
  screenTitle:{color:theme.text,fontSize:18,fontWeight:'800'},
  screenSub:{color:theme.muted,fontSize:12},
  content:{padding:20,gap:20,paddingBottom:40},
  heroCard:{backgroundColor:theme.surface,borderColor:theme.border,borderWidth:1,borderRadius:28,padding:24,overflow:'hidden',position:'relative',shadowColor:theme.shadow,shadowOffset:{width:0,height:14},shadowOpacity:0.1,shadowRadius:24},
  orb:{position:'absolute',width:140,height:140,borderRadius:999},
  orbTop:{top:-40,right:-30}, orbBottom:{bottom:-50,left:-30},
  eyebrow:{color:theme.primary,fontSize:11,fontWeight:'800',letterSpacing:1.2,textTransform:'uppercase',marginBottom:10},
  heroTitle:{color:theme.text,fontSize:26,fontWeight:'900',lineHeight:32,marginBottom:8},
  heroBody:{color:theme.muted,fontSize:15,lineHeight:22,maxWidth:'88%'},
  badgeRow:{flexDirection:'row',flexWrap:'wrap',gap:10,marginTop:16},
  metricGrid:{flexDirection:'row',flexWrap:'wrap',gap:12,justifyContent:'space-between'},
  panel:{backgroundColor:theme.surface,borderColor:theme.border,borderWidth:1,borderRadius:24,padding:20,gap:16,shadowColor:theme.shadow,shadowOffset:{width:0,height:10},shadowOpacity:0.07,shadowRadius:20},
  domainRow:{gap:4},
  domainHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  domainLabel:{color:theme.text,fontSize:15,fontWeight:'700'},
  domainStatus:{color:theme.muted,fontSize:12},
  domainPercent:{color:theme.text,fontSize:13,fontWeight:'800',alignSelf:'flex-end'},
});
