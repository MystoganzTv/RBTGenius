import { StatusBar } from 'expo-status-bar';
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { useState } from 'react';
import { useColorScheme } from 'react-native';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  appUser,
  examModes,
  pricingPlans,
  primaryTabs,
  profileActions,
  quickLinks,
  routeMeta,
  tutorMessages,
  tutorPrompts,
  weeklyPerformance,
  type RouteKey,
} from './src/data/appData';
import { alpha, getTheme, type ThemeMode } from './src/theme';
import {
  buildDomainStats,
  getFlashcards,
  getPracticeByTopic,
  TOPICS,
  TOTAL_PRACTICE_QUESTIONS,
} from './src/services/questionService.js';

// ─── Real data (computed once at module level) ────────────────────────────────
const domainStats = buildDomainStats();
const allFlashcards = getFlashcards(120);

type Accent = 'primary' | 'gold' | 'success';

const accentColors = (
  accent: Accent,
  theme: ReturnType<typeof getTheme>,
): string => {
  if (accent === 'gold') {
    return theme.gold;
  }

  if (accent === 'success') {
    return theme.success;
  }

  return theme.primary;
};

const routeIcon = (
  route: RouteKey,
  color: string,
  size: number,
) => {
  switch (route) {
    case 'Dashboard':
      return <MaterialCommunityIcons color={color} name="view-dashboard-outline" size={size} />;
    case 'Practice':
      return <Feather color={color} name="book-open" size={size} />;
    case 'MockExams':
      return <Ionicons color={color} name="clipboard-outline" size={size} />;
    case 'AITutor':
      return <MaterialCommunityIcons color={color} name="robot-outline" size={size} />;
    case 'Analytics':
      return <Ionicons color={color} name="stats-chart-outline" size={size} />;
    case 'Flashcards':
      return <MaterialCommunityIcons color={color} name="cards-outline" size={size} />;
    case 'Pricing':
      return <Ionicons color={color} name="diamond-outline" size={size} />;
    case 'Profile':
      return <Ionicons color={color} name="person-circle-outline" size={size} />;
    case 'More':
      return <Feather color={color} name="grid" size={size} />;
  }
};

export default function App() {
  const deviceScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>(
    deviceScheme === 'dark' ? 'dark' : 'light',
  );
  const [activeRoute, setActiveRoute] = useState<RouteKey>('Dashboard');
  // selectedTopic is a topic key: "measurement" | "assessment" | etc.
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0].key);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [selectedExam, setSelectedExam] = useState(examModes[0].id);
  const [flashIndex, setFlashIndex] = useState(0);
  const [showFlashAnswer, setShowFlashAnswer] = useState(false);
  const theme = getTheme(themeMode);
  const styles = createStyles(theme);
  const selectedBottomTab = primaryTabs.includes(activeRoute)
    ? activeRoute
    : 'More';

  // Real questions from the bank, filtered by topic
  const topicQuestions = getPracticeByTopic(selectedTopic, 24);
  const currentQuestion = topicQuestions[0] ?? getPracticeByTopic(null, 1)[0];
  const currentFlashcard = allFlashcards[flashIndex];
  const activeExamMode =
    examModes.find((mode) => mode.id === selectedExam) ?? examModes[0];

  const navigateTo = (route: RouteKey) => {
    setActiveRoute(route);
    setSelectedOption(null);
  };

  const goToNextFlashcard = () => {
    setShowFlashAnswer(false);
    setFlashIndex((current) => (current + 1) % allFlashcards.length);
  };

  const renderDashboard = () => (
    <ScrollView
      contentContainerStyle={styles.screenContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heroCard}>
        <View style={[styles.orb, styles.orbTop, { backgroundColor: alpha(theme.gold, 0.16) }]} />
        <View
          style={[
            styles.orb,
            styles.orbBottom,
            { backgroundColor: alpha(theme.primary, 0.18) },
          ]}
        />
        <Text style={styles.heroEyebrow}>RBT Genius Mobile</Text>
        <Text style={styles.heroTitle}>Welcome back, {appUser.firstName}</Text>
        <Text style={styles.heroBody}>
          Exam Readiness at {appUser.readiness}% based on your latest practice
          performance.
        </Text>
        <View style={styles.heroBadgeRow}>
          <Badge label={`Study streak ${appUser.streak} days`} theme={theme} />
          <Badge label={`${appUser.planLabel}`} tone="gold" theme={theme} />
        </View>
      </View>

      <SectionTitle
        subtitle="Your progress at a glance"
        theme={theme}
        title="Daily snapshot"
      />
      <View style={styles.metricGrid}>
        <MetricCard
          accent="primary"
          label="Questions Done"
          theme={theme}
          value="248"
        />
        <MetricCard
          accent="gold"
          label="Accuracy Rate"
          theme={theme}
          value="84%"
        />
        <MetricCard
          accent="success"
          label="Study Streak"
          theme={theme}
          value={`${appUser.streak} days`}
        />
        <MetricCard
          accent="primary"
          label="Questions Available"
          theme={theme}
          value={TOTAL_PRACTICE_QUESTIONS.toLocaleString()}
        />
      </View>

      <SectionTitle
        subtitle="Fast jumps into the most used areas"
        theme={theme}
        title="Quick Actions"
      />
      <View style={styles.quickActionGrid}>
        {quickLinks.map((item) => (
          <Pressable
            key={item.route}
            onPress={() => navigateTo(item.route)}
            style={({ pressed }) => [
              styles.quickActionCard,
              pressed && styles.pressed,
            ]}
          >
            <View
              style={[
                styles.quickActionIcon,
                { backgroundColor: alpha(accentColors(item.accent, theme), 0.14) },
              ]}
            >
              {routeIcon(item.route, accentColors(item.accent, theme), 18)}
            </View>
            <Text style={styles.quickActionTitle}>{item.title}</Text>
            <Text style={styles.quickActionBody}>{item.description}</Text>
          </Pressable>
        ))}
      </View>

      <SectionTitle
        subtitle="Based on your practice by content area"
        theme={theme}
        title="Domain Mastery"
      />
      <View style={styles.panel}>
        {domainStats.map((domain) => (
          <View key={domain.label} style={styles.domainRow}>
            <View style={styles.domainCopy}>
              <Text style={styles.domainTitle}>{domain.label}</Text>
              <Text style={styles.domainNote}>{domain.status}</Text>
            </View>
            <Text style={styles.domainPercent}>{domain.mastery}%</Text>
            <ProgressBar
              color={accentColors(domain.accent, theme)}
              progress={domain.mastery}
              theme={theme}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderPractice = () => (
    <ScrollView
      contentContainerStyle={styles.screenContent}
      showsVerticalScrollIndicator={false}
    >
      <SectionTitle
        subtitle="Pick a domain and answer a mobile-friendly practice set"
        theme={theme}
        title="Practice Questions"
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.inlineScroller}
      >
        {TOPICS.map((topic) => {
          const active = topic.key === selectedTopic;
          return (
            <Pressable
              key={topic.key}
              onPress={() => {
                setSelectedTopic(topic.key);
                setSelectedOption(null);
              }}
              style={[
                styles.pill,
                active && {
                  backgroundColor: alpha(theme.primary, 0.12),
                  borderColor: alpha(theme.primary, 0.4),
                },
              ]}
            >
              <Text
                style={[
                  styles.pillText,
                  active && { color: theme.primary },
                ]}
              >
                {topic.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.panel}>
        <View style={styles.panelHeader}>
          <Badge label={currentQuestion.difficulty} theme={theme} />
          <Badge label={`${currentQuestion.timeEstimate} min`} tone="gold" theme={theme} />
        </View>
        <Text style={styles.questionPrompt}>{currentQuestion.prompt}</Text>
        <View style={styles.optionList}>
          {(currentQuestion.options as string[]).map((option: string, index: number) => {
            const isSelected = selectedOption === index;
            const isCorrect = index === (currentQuestion.correctIndex as number);
            const showFeedback = selectedOption !== null;

            return (
              <Pressable
                key={option}
                onPress={() => setSelectedOption(index)}
                style={[
                  styles.optionCard,
                  isSelected && {
                    borderColor: isCorrect ? theme.success : theme.primary,
                    backgroundColor: alpha(
                      isCorrect ? theme.success : theme.primary,
                      0.12,
                    ),
                  },
                  showFeedback &&
                    isCorrect && {
                      borderColor: theme.success,
                    },
                ]}
              >
                <Text style={styles.optionLetter}>
                  {String.fromCharCode(65 + index)}
                </Text>
                <Text style={styles.optionText}>{option}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.panel}>
        <SectionTitle
          subtitle="A short rationale to keep the learning loop fast"
          theme={theme}
          title="Why This Works"
        />
        <Text style={styles.explanationBody}>{currentQuestion.explanation}</Text>
      </View>
    </ScrollView>
  );

  const renderMockExams = () => (
    <ScrollView
      contentContainerStyle={styles.screenContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.panel}>
        <SectionTitle
          subtitle="Train under pressure with structured timed exams"
          theme={theme}
          title="Mock Exams"
        />
        <Text style={styles.supportCopy}>
          Build confidence with 20, 50, or full-length 85-question simulations.
        </Text>
        <View style={styles.metricGrid}>
          {examModes.map((mode) => {
            const active = mode.id === selectedExam;
            return (
              <Pressable
                key={mode.id}
                onPress={() => setSelectedExam(mode.id)}
                style={[
                  styles.modeCard,
                  active && {
                    borderColor: theme.primary,
                    backgroundColor: alpha(theme.primary, 0.12),
                  },
                ]}
              >
                <Text style={styles.modeTitle}>{mode.title}</Text>
                <Text style={styles.modeStat}>{mode.questions} questions</Text>
                <Text style={styles.modeBody}>{mode.duration}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.panel}>
        <SectionTitle
          subtitle="Current selection"
          theme={theme}
          title={activeExamMode.title}
        />
        <Text style={styles.supportCopy}>{activeExamMode.summary}</Text>
        <View style={styles.bulletList}>
          {activeExamMode.highlights.map((highlight) => (
            <View key={highlight} style={styles.bulletRow}>
              <Ionicons color={theme.primary} name="checkmark-circle" size={18} />
              <Text style={styles.bulletText}>{highlight}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderAITutor = () => (
    <ScrollView
      contentContainerStyle={styles.screenContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.panel, styles.tutorHero]}>
        <SectionTitle
          subtitle="Your practice coach for explanations, mnemonics and feedback"
          theme={theme}
          title="AI Tutor"
        />
        <Text style={styles.supportCopy}>
          Start from a prompt or adapt the tutor panel later to your real API.
        </Text>
        <TextInput
          editable={false}
          placeholder="Ask the AI Tutor about reinforcement schedules..."
          placeholderTextColor={theme.muted}
          style={styles.fakeInput}
        />
      </View>

      <SectionTitle
        subtitle="Suggested ways to begin the conversation"
        theme={theme}
        title="Prompt Starters"
      />
      <View style={styles.quickActionGrid}>
        {tutorPrompts.map((prompt) => (
          <View key={prompt.title} style={styles.quickActionCard}>
            <Text style={styles.quickActionTitle}>{prompt.title}</Text>
            <Text style={styles.quickActionBody}>{prompt.body}</Text>
          </View>
        ))}
      </View>

      <SectionTitle
        subtitle="Sample tutor flow for the mobile experience"
        theme={theme}
        title="Conversation Preview"
      />
      <View style={styles.messageList}>
        {tutorMessages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.author === 'user'
                ? styles.userBubble
                : styles.assistantBubble,
            ]}
          >
            <Text style={styles.messageAuthor}>
              {message.author === 'user' ? 'You' : 'AI Tutor'}
            </Text>
            <Text style={styles.messageBody}>{message.body}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderAnalytics = () => (
    <ScrollView
      contentContainerStyle={styles.screenContent}
      showsVerticalScrollIndicator={false}
    >
      <SectionTitle
        subtitle="Seven-day snapshot of your performance"
        theme={theme}
        title="Analytics"
      />
      <View style={styles.panel}>
        <Text style={styles.chartLabel}>Weekly accuracy trend</Text>
        <View style={styles.chart}>
          {weeklyPerformance.map((item) => (
            <View key={item.day} style={styles.chartColumn}>
              <View style={styles.chartTrack}>
                <View
                  style={[
                    styles.chartFill,
                    {
                      backgroundColor: item.highlight
                        ? theme.gold
                        : theme.primary,
                      height: `${item.score}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.chartDay}>{item.day}</Text>
              <Text style={styles.chartScore}>{item.score}%</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.panel}>
        <SectionTitle
          subtitle="Where to keep pushing next"
          theme={theme}
          title="Recommended Focus"
        />
        {domainStats.map((domain) => (
          <View key={domain.label} style={styles.analyticsRow}>
            <View style={styles.analyticsCopy}>
              <Text style={styles.domainTitle}>{domain.label}</Text>
              <Text style={styles.domainNote}>{domain.recommendation}</Text>
            </View>
            <Text style={styles.domainPercent}>{domain.mastery}%</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderFlashcards = () => (
    <ScrollView
      contentContainerStyle={styles.screenContent}
      showsVerticalScrollIndicator={false}
    >
      <SectionTitle
        subtitle="Tap to flip and keep drilling the concepts that matter"
        theme={theme}
        title="Flashcards"
      />
      <Pressable
        onPress={() => setShowFlashAnswer((current) => !current)}
        style={[styles.flashcard, showFlashAnswer && styles.flashcardActive]}
      >
        <Text style={styles.flashcardTag}>
          {currentFlashcard.domain} • Card {flashIndex + 1}/{allFlashcards.length}
        </Text>
        <Text style={styles.flashcardPrompt}>
          {showFlashAnswer ? currentFlashcard.answer : currentFlashcard.question}
        </Text>
        <Text style={styles.flashcardHint}>
          {showFlashAnswer ? 'Tap to see the prompt again' : 'Tap to reveal the answer'}
        </Text>
      </Pressable>

      <View style={styles.flashcardActions}>
        <Pressable onPress={() => setShowFlashAnswer(true)} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Show Answer</Text>
        </Pressable>
        <Pressable onPress={goToNextFlashcard} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Next Card</Text>
        </Pressable>
      </View>
    </ScrollView>
  );

  const renderPricing = () => (
    <ScrollView
      contentContainerStyle={styles.screenContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.heroCard, styles.pricingHero]}>
        <Text style={styles.heroEyebrow}>Upgrade to Pro</Text>
        <Text style={styles.heroTitle}>Unlock mock exams, AI workflows and deep analytics</Text>
        <Text style={styles.heroBody}>
          Keep the free practice flow, then step into a premium study system when
          you want more structure.
        </Text>
      </View>

      {pricingPlans.map((plan) => (
        <View
          key={plan.id}
          style={[
            styles.planCard,
            plan.featured && {
              borderColor: alpha(theme.gold, 0.6),
              backgroundColor: alpha(theme.gold, 0.08),
            },
          ]}
        >
          <View style={styles.planHeader}>
            <View>
              <Text style={styles.planTitle}>{plan.title}</Text>
              <Text style={styles.planPrice}>{plan.price}</Text>
            </View>
            {plan.featured ? <Badge label="Best value" tone="gold" theme={theme} /> : null}
          </View>
          <Text style={styles.planBody}>{plan.description}</Text>
          <View style={styles.bulletList}>
            {plan.features.map((feature) => (
              <View key={feature} style={styles.bulletRow}>
                <Ionicons color={theme.primary} name="checkmark-circle" size={18} />
                <Text style={styles.bulletText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderProfile = () => (
    <ScrollView
      contentContainerStyle={styles.screenContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.panel}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLabel}>{appUser.initials}</Text>
          </View>
          <View style={styles.profileCopy}>
            <Text style={styles.profileName}>{appUser.name}</Text>
            <Text style={styles.profileMeta}>
              {appUser.planLabel} • {appUser.goal}
            </Text>
          </View>
        </View>

        <View style={styles.profileMetrics}>
          <MetricCard
            accent="primary"
            label="Readiness"
            theme={theme}
            value={`${appUser.readiness}%`}
          />
          <MetricCard
            accent="gold"
            label="Questions"
            theme={theme}
            value={`${appUser.completedQuestions}`}
          />
        </View>
      </View>

      <View style={styles.panel}>
        <View style={styles.settingRow}>
          <View style={styles.settingCopy}>
            <Text style={styles.settingTitle}>Dark mode</Text>
            <Text style={styles.settingBody}>Match the web app theme toggle</Text>
          </View>
          <Switch
            onValueChange={(value) => setThemeMode(value ? 'dark' : 'light')}
            thumbColor="#ffffff"
            trackColor={{ false: alpha(theme.primary, 0.24), true: theme.primary }}
            value={themeMode === 'dark'}
          />
        </View>

        {profileActions.map((action) => (
          <View key={action.title} style={styles.settingRow}>
            <View style={styles.settingCopy}>
              <Text style={styles.settingTitle}>{action.title}</Text>
              <Text style={styles.settingBody}>{action.body}</Text>
            </View>
            <Feather color={theme.muted} name="chevron-right" size={18} />
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderMore = () => (
    <ScrollView
      contentContainerStyle={styles.screenContent}
      showsVerticalScrollIndicator={false}
    >
      <SectionTitle
        subtitle="Everything beyond the main study flow"
        theme={theme}
        title="More Tools"
      />
      <View style={styles.quickActionGrid}>
        {(['Analytics', 'Flashcards', 'Pricing', 'Profile'] as RouteKey[]).map(
          (route) => (
            <Pressable
              key={route}
              onPress={() => navigateTo(route)}
              style={({ pressed }) => [
                styles.quickActionCard,
                pressed && styles.pressed,
              ]}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: alpha(theme.primary, 0.12) },
                ]}
              >
                {routeIcon(route, theme.primary, 18)}
              </View>
              <Text style={styles.quickActionTitle}>{routeMeta[route].title}</Text>
              <Text style={styles.quickActionBody}>{routeMeta[route].subtitle}</Text>
            </Pressable>
          ),
        )}
      </View>
    </ScrollView>
  );

  const renderScreen = () => {
    switch (activeRoute) {
      case 'Dashboard':
        return renderDashboard();
      case 'Practice':
        return renderPractice();
      case 'MockExams':
        return renderMockExams();
      case 'AITutor':
        return renderAITutor();
      case 'Analytics':
        return renderAnalytics();
      case 'Flashcards':
        return renderFlashcards();
      case 'Pricing':
        return renderPricing();
      case 'Profile':
        return renderProfile();
      case 'More':
        return renderMore();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
      <View style={styles.appShell}>
        <View style={styles.topBar}>
          <View style={styles.brandBlock}>
            <View style={styles.brandMark}>
              <Text style={styles.brandMarkLabel}>RG</Text>
            </View>
            <View>
              <Text style={styles.screenTitle}>{routeMeta[activeRoute].title}</Text>
              <Text style={styles.screenSubtitle}>{routeMeta[activeRoute].subtitle}</Text>
            </View>
          </View>
          {!primaryTabs.includes(activeRoute) ? (
            <Pressable onPress={() => navigateTo('More')} style={styles.backButton}>
              <Feather color={theme.text} name="arrow-left" size={18} />
            </Pressable>
          ) : null}
        </View>

        <View style={styles.content}>{renderScreen()}</View>

        <View style={styles.bottomBar}>
          {primaryTabs.map((tab) => {
            const active = tab === selectedBottomTab;
            return (
              <Pressable
                key={tab}
                onPress={() => navigateTo(tab)}
                style={styles.bottomTab}
              >
                <View
                  style={[
                    styles.bottomTabIcon,
                    active && {
                      backgroundColor: alpha(theme.primary, 0.14),
                    },
                  ]}
                >
                  {routeIcon(tab, active ? theme.primary : theme.muted, 20)}
                </View>
                <Text
                  style={[
                    styles.bottomTabLabel,
                    active && { color: theme.primary },
                  ]}
                >
                  {tab === 'MockExams' ? 'Exams' : tab === 'AITutor' ? 'Tutor' : tab}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

type BadgeProps = {
  label: string;
  theme: ReturnType<typeof getTheme>;
  tone?: Accent;
};

function Badge({ label, theme, tone = 'primary' }: BadgeProps) {
  return (
    <View
      style={[
        badgeStyles.badge,
        {
          backgroundColor: alpha(accentColors(tone, theme), 0.14),
          borderColor: alpha(accentColors(tone, theme), 0.24),
        },
      ]}
    >
      <Text style={[badgeStyles.label, { color: accentColors(tone, theme) }]}>
        {label}
      </Text>
    </View>
  );
}

type MetricCardProps = {
  accent: Accent;
  label: string;
  theme: ReturnType<typeof getTheme>;
  value: string;
};

function MetricCard({ accent, label, theme, value }: MetricCardProps) {
  const color = accentColors(accent, theme);

  return (
    <View
      style={[
        sharedStyles.metricCard,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          shadowColor: theme.shadow,
        },
      ]}
    >
      <View
        style={[
          sharedStyles.metricAccent,
          { backgroundColor: alpha(color, 0.14) },
        ]}
      />
      <Text style={[sharedStyles.metricValue, { color: theme.text }]}>{value}</Text>
      <Text style={[sharedStyles.metricLabel, { color: theme.muted }]}>{label}</Text>
    </View>
  );
}

type ProgressBarProps = {
  color: string;
  progress: number;
  theme: ReturnType<typeof getTheme>;
};

function ProgressBar({ color, progress, theme }: ProgressBarProps) {
  return (
    <View
      style={[
        sharedStyles.progressTrack,
        { backgroundColor: alpha(theme.primary, 0.08) },
      ]}
    >
      <View
        style={[
          sharedStyles.progressFill,
          { backgroundColor: color, width: `${progress}%` },
        ]}
      />
    </View>
  );
}

type SectionTitleProps = {
  subtitle: string;
  theme: ReturnType<typeof getTheme>;
  title: string;
};

function SectionTitle({ subtitle, theme, title }: SectionTitleProps) {
  return (
    <View style={sharedStyles.sectionTitleWrap}>
      <Text style={[sharedStyles.sectionTitle, { color: theme.text }]}>{title}</Text>
      <Text style={[sharedStyles.sectionSubtitle, { color: theme.muted }]}>
        {subtitle}
      </Text>
    </View>
  );
}

const badgeStyles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

const sharedStyles = StyleSheet.create({
  metricCard: {
    borderRadius: 24,
    borderWidth: 1,
    flexBasis: '48%',
    gap: 6,
    minHeight: 120,
    overflow: 'hidden',
    padding: 18,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 22,
  },
  metricAccent: {
    borderRadius: 999,
    height: 10,
    marginBottom: 8,
    width: 44,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  metricLabel: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  progressTrack: {
    borderRadius: 999,
    height: 10,
    marginTop: 10,
    overflow: 'hidden',
    width: '100%',
  },
  progressFill: {
    borderRadius: 999,
    height: '100%',
  },
  sectionTitleWrap: {
    gap: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  sectionSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
});

const createStyles = (theme: ReturnType<typeof getTheme>) =>
  StyleSheet.create({
    safeArea: {
      backgroundColor: theme.background,
      flex: 1,
    },
    appShell: {
      backgroundColor: theme.background,
      flex: 1,
    },
    topBar: {
      alignItems: 'center',
      backgroundColor: theme.background,
      borderBottomColor: alpha(theme.border, 0.65),
      borderBottomWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    brandBlock: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 14,
    },
    brandMark: {
      alignItems: 'center',
      backgroundColor: theme.primary,
      borderRadius: 18,
      height: 42,
      justifyContent: 'center',
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.18,
      shadowRadius: 18,
      width: 42,
    },
    brandMarkLabel: {
      color: '#ffffff',
      fontSize: 15,
      fontWeight: '800',
      letterSpacing: 0.6,
    },
    screenTitle: {
      color: theme.text,
      fontSize: 20,
      fontWeight: '800',
    },
    screenSubtitle: {
      color: theme.muted,
      fontSize: 13,
      lineHeight: 18,
      marginTop: 2,
      maxWidth: 220,
    },
    backButton: {
      alignItems: 'center',
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderRadius: 16,
      borderWidth: 1,
      height: 42,
      justifyContent: 'center',
      width: 42,
    },
    content: {
      flex: 1,
    },
    screenContent: {
      gap: 20,
      paddingBottom: 120,
      paddingHorizontal: 20,
      paddingTop: 18,
    },
    heroCard: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderRadius: 30,
      borderWidth: 1,
      overflow: 'hidden',
      padding: 24,
      position: 'relative',
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 18 },
      shadowOpacity: 0.12,
      shadowRadius: 26,
    },
    pricingHero: {
      backgroundColor: theme.surface,
    },
    orb: {
      borderRadius: 999,
      height: 140,
      position: 'absolute',
      width: 140,
    },
    orbTop: {
      right: -30,
      top: -40,
    },
    orbBottom: {
      bottom: -50,
      left: -30,
    },
    heroEyebrow: {
      color: theme.primary,
      fontSize: 12,
      fontWeight: '800',
      letterSpacing: 1,
      marginBottom: 12,
      textTransform: 'uppercase',
    },
    heroTitle: {
      color: theme.text,
      fontSize: 28,
      fontWeight: '900',
      lineHeight: 34,
      marginBottom: 10,
      maxWidth: '88%',
    },
    heroBody: {
      color: theme.muted,
      fontSize: 15,
      lineHeight: 22,
      maxWidth: '88%',
    },
    heroBadgeRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginTop: 18,
    },
    metricGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      justifyContent: 'space-between',
    },
    quickActionGrid: {
      gap: 12,
    },
    quickActionCard: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderRadius: 24,
      borderWidth: 1,
      gap: 12,
      padding: 18,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.08,
      shadowRadius: 22,
    },
    pressed: {
      opacity: 0.92,
      transform: [{ scale: 0.995 }],
    },
    quickActionIcon: {
      alignItems: 'center',
      borderRadius: 14,
      height: 40,
      justifyContent: 'center',
      width: 40,
    },
    quickActionTitle: {
      color: theme.text,
      fontSize: 18,
      fontWeight: '800',
    },
    quickActionBody: {
      color: theme.muted,
      fontSize: 14,
      lineHeight: 21,
    },
    panel: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderRadius: 28,
      borderWidth: 1,
      gap: 18,
      padding: 20,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 14 },
      shadowOpacity: 0.08,
      shadowRadius: 24,
    },
    panelHeader: {
      flexDirection: 'row',
      gap: 10,
      justifyContent: 'space-between',
    },
    domainRow: {
      marginBottom: 14,
    },
    domainCopy: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 2,
    },
    domainTitle: {
      color: theme.text,
      fontSize: 15,
      fontWeight: '700',
      maxWidth: '72%',
    },
    domainNote: {
      color: theme.muted,
      fontSize: 13,
      lineHeight: 18,
    },
    domainPercent: {
      alignSelf: 'flex-end',
      color: theme.text,
      fontSize: 13,
      fontWeight: '800',
      marginBottom: 6,
    },
    inlineScroller: {
      flexGrow: 0,
    },
    pill: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderRadius: 999,
      borderWidth: 1,
      marginRight: 10,
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    pillText: {
      color: theme.muted,
      fontSize: 13,
      fontWeight: '700',
    },
    questionPrompt: {
      color: theme.text,
      fontSize: 20,
      fontWeight: '800',
      lineHeight: 28,
    },
    optionList: {
      gap: 10,
    },
    optionCard: {
      backgroundColor: theme.surfaceAlt,
      borderColor: theme.border,
      borderRadius: 22,
      borderWidth: 1,
      flexDirection: 'row',
      gap: 14,
      padding: 16,
    },
    optionLetter: {
      color: theme.primary,
      fontSize: 16,
      fontWeight: '800',
      width: 18,
    },
    optionText: {
      color: theme.text,
      flex: 1,
      fontSize: 15,
      fontWeight: '600',
      lineHeight: 22,
    },
    explanationBody: {
      color: theme.muted,
      fontSize: 15,
      lineHeight: 24,
    },
    supportCopy: {
      color: theme.muted,
      fontSize: 15,
      lineHeight: 23,
    },
    modeCard: {
      backgroundColor: theme.surfaceAlt,
      borderColor: theme.border,
      borderRadius: 24,
      borderWidth: 1,
      flexBasis: '48%',
      gap: 6,
      minHeight: 124,
      padding: 16,
    },
    modeTitle: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '800',
    },
    modeStat: {
      color: theme.primary,
      fontSize: 15,
      fontWeight: '700',
    },
    modeBody: {
      color: theme.muted,
      fontSize: 13,
      lineHeight: 19,
    },
    bulletList: {
      gap: 12,
    },
    bulletRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 10,
    },
    bulletText: {
      color: theme.text,
      flex: 1,
      fontSize: 14,
      lineHeight: 21,
    },
    tutorHero: {
      gap: 14,
    },
    fakeInput: {
      backgroundColor: theme.surfaceAlt,
      borderColor: theme.border,
      borderRadius: 22,
      borderWidth: 1,
      color: theme.muted,
      fontSize: 15,
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    messageList: {
      gap: 12,
    },
    messageBubble: {
      borderRadius: 24,
      gap: 6,
      maxWidth: '92%',
      padding: 16,
    },
    userBubble: {
      alignSelf: 'flex-end',
      backgroundColor: alpha(theme.primary, 0.12),
      borderTopRightRadius: 10,
    },
    assistantBubble: {
      alignSelf: 'flex-start',
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderTopLeftRadius: 10,
      borderWidth: 1,
    },
    messageAuthor: {
      color: theme.primary,
      fontSize: 12,
      fontWeight: '800',
      textTransform: 'uppercase',
    },
    messageBody: {
      color: theme.text,
      fontSize: 15,
      lineHeight: 22,
    },
    chartLabel: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '800',
    },
    chart: {
      alignItems: 'flex-end',
      flexDirection: 'row',
      gap: 12,
      height: 220,
      justifyContent: 'space-between',
      paddingTop: 12,
    },
    chartColumn: {
      alignItems: 'center',
      flex: 1,
      gap: 8,
    },
    chartTrack: {
      alignItems: 'center',
      backgroundColor: alpha(theme.primary, 0.08),
      borderRadius: 999,
      flex: 1,
      justifyContent: 'flex-end',
      overflow: 'hidden',
      width: 24,
    },
    chartFill: {
      borderRadius: 999,
      width: '100%',
    },
    chartDay: {
      color: theme.muted,
      fontSize: 12,
      fontWeight: '700',
    },
    chartScore: {
      color: theme.text,
      fontSize: 12,
      fontWeight: '800',
    },
    analyticsRow: {
      alignItems: 'center',
      borderBottomColor: alpha(theme.border, 0.7),
      borderBottomWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 14,
    },
    analyticsCopy: {
      flex: 1,
      paddingRight: 16,
    },
    flashcard: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderRadius: 30,
      borderWidth: 1,
      minHeight: 280,
      padding: 24,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.1,
      shadowRadius: 24,
    },
    flashcardActive: {
      backgroundColor: alpha(theme.primary, 0.08),
      borderColor: alpha(theme.primary, 0.3),
    },
    flashcardTag: {
      color: theme.primary,
      fontSize: 12,
      fontWeight: '800',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
    },
    flashcardPrompt: {
      color: theme.text,
      fontSize: 26,
      fontWeight: '900',
      lineHeight: 34,
      marginTop: 20,
    },
    flashcardHint: {
      color: theme.muted,
      fontSize: 14,
      lineHeight: 21,
      marginTop: 18,
    },
    flashcardActions: {
      flexDirection: 'row',
      gap: 12,
    },
    secondaryButton: {
      alignItems: 'center',
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderRadius: 18,
      borderWidth: 1,
      flex: 1,
      paddingVertical: 16,
    },
    secondaryButtonText: {
      color: theme.text,
      fontSize: 15,
      fontWeight: '800',
    },
    primaryButton: {
      alignItems: 'center',
      backgroundColor: theme.primary,
      borderRadius: 18,
      flex: 1,
      paddingVertical: 16,
    },
    primaryButtonText: {
      color: '#ffffff',
      fontSize: 15,
      fontWeight: '800',
    },
    planCard: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderRadius: 28,
      borderWidth: 1,
      gap: 14,
      padding: 20,
    },
    planHeader: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    planTitle: {
      color: theme.text,
      fontSize: 20,
      fontWeight: '800',
    },
    planPrice: {
      color: theme.primary,
      fontSize: 18,
      fontWeight: '800',
      marginTop: 6,
    },
    planBody: {
      color: theme.muted,
      fontSize: 14,
      lineHeight: 21,
    },
    profileHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 16,
    },
    avatar: {
      alignItems: 'center',
      backgroundColor: theme.primary,
      borderRadius: 28,
      height: 56,
      justifyContent: 'center',
      width: 56,
    },
    avatarLabel: {
      color: '#ffffff',
      fontSize: 18,
      fontWeight: '800',
    },
    profileCopy: {
      flex: 1,
      gap: 4,
    },
    profileName: {
      color: theme.text,
      fontSize: 20,
      fontWeight: '800',
    },
    profileMeta: {
      color: theme.muted,
      fontSize: 14,
    },
    profileMetrics: {
      flexDirection: 'row',
      gap: 12,
      justifyContent: 'space-between',
    },
    settingRow: {
      alignItems: 'center',
      borderBottomColor: alpha(theme.border, 0.7),
      borderBottomWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 16,
    },
    settingCopy: {
      flex: 1,
      paddingRight: 16,
    },
    settingTitle: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '700',
    },
    settingBody: {
      color: theme.muted,
      fontSize: 13,
      lineHeight: 19,
      marginTop: 4,
    },
    bottomBar: {
      backgroundColor: theme.surface,
      borderTopColor: alpha(theme.border, 0.8),
      borderTopWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: 18,
      paddingHorizontal: 16,
      paddingTop: 12,
    },
    bottomTab: {
      alignItems: 'center',
      flex: 1,
      gap: 6,
    },
    bottomTabIcon: {
      alignItems: 'center',
      borderRadius: 16,
      height: 38,
      justifyContent: 'center',
      width: 48,
    },
    bottomTabLabel: {
      color: theme.muted,
      fontSize: 11,
      fontWeight: '700',
    },
  });
