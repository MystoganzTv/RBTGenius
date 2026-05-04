import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import * as Haptics from 'expo-haptics';

import { alpha, getTheme } from '../../theme';
import { TOPICS } from '../../services/questionService.js';
import { getFlashcards } from '../../services/questionService.js';

const allCards = getFlashcards(120);

export default function FlashcardsScreen() {
  const scheme = useColorScheme();
  const theme = getTheme(scheme === 'dark' ? 'dark' : 'light');
  const s = styles(theme);

  const [filterTopic, setFilterTopic] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<string>>(new Set());
  const [reviewing, setReviewing] = useState<Set<string>>(new Set());

  const filtered = filterTopic
    ? allCards.filter((c) => c.topic === filterTopic)
    : allCards;
  const card = filtered[index];

  const flip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFlipped((f) => !f);
  };

  const markKnown = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (card) setKnown((s) => new Set([...s, card.id]));
    next();
  };

  const markReview = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (card) setReviewing((s) => new Set([...s, card.id]));
    next();
  };

  const next = () => {
    setFlipped(false);
    setIndex((i) => (i + 1) % filtered.length);
  };

  const prev = () => {
    setFlipped(false);
    setIndex((i) => (i - 1 + filtered.length) % filtered.length);
  };

  const isKnown = card ? known.has(card.id) : false;
  const isReview = card ? reviewing.has(card.id) : false;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.topBar}>
        <Text style={s.screenTitle}>Flashcards</Text>
        <Text style={s.screenSub}>
          {index + 1} / {filtered.length} · {known.size} known · {reviewing.size} to review
        </Text>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Topic filter pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.pillScroll}>
          <Pressable
            onPress={() => { setFilterTopic(null); setIndex(0); setFlipped(false); }}
            style={[s.pill, !filterTopic && { backgroundColor: alpha(theme.primary, 0.12), borderColor: alpha(theme.primary, 0.4) }]}
          >
            <Text style={[s.pillText, !filterTopic && { color: theme.primary }]}>All</Text>
          </Pressable>
          {TOPICS.map((t) => {
            const active = filterTopic === t.key;
            return (
              <Pressable
                key={t.key}
                onPress={() => { setFilterTopic(t.key); setIndex(0); setFlipped(false); }}
                style={[s.pill, active && { backgroundColor: alpha(theme.primary, 0.12), borderColor: alpha(theme.primary, 0.4) }]}
              >
                <Text style={[s.pillText, active && { color: theme.primary }]}>{t.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Card */}
        {card && (
          <Pressable
            onPress={flip}
            style={[
              s.card,
              flipped && { backgroundColor: alpha(theme.primary, 0.07), borderColor: alpha(theme.primary, 0.3) },
              isKnown && { borderColor: alpha(theme.success, 0.5) },
              isReview && { borderColor: alpha(theme.gold, 0.5) },
            ]}
          >
            <Text style={s.cardDomain}>{card.domain}</Text>

            <View style={s.cardBody}>
              <Text style={s.cardSide}>{flipped ? 'Answer' : 'Term'}</Text>
              <Text style={s.cardText}>
                {flipped ? card.answer : card.question}
              </Text>
            </View>

            <Text style={s.cardHint}>
              {flipped ? 'Tap to see the term again' : 'Tap to reveal the answer'}
            </Text>
          </Pressable>
        )}

        {/* Action buttons */}
        <View style={s.actionRow}>
          <Pressable style={[s.actionBtn, { borderColor: alpha('#EF4444', 0.5) }]} onPress={markReview}>
            <Text style={[s.actionBtnText, { color: '#EF4444' }]}>Study More</Text>
          </Pressable>
          <Pressable style={[s.actionBtn, { borderColor: alpha(theme.success, 0.5) }]} onPress={markKnown}>
            <Text style={[s.actionBtnText, { color: theme.success }]}>Got It ✓</Text>
          </Pressable>
        </View>

        {/* Nav row */}
        <View style={s.navRow}>
          <Pressable style={s.navBtn} onPress={prev}>
            <Text style={s.navBtnText}>← Prev</Text>
          </Pressable>
          <Pressable style={[s.navBtn, s.navBtnPrimary]} onPress={next}>
            <Text style={[s.navBtnText, { color: '#fff' }]}>Next →</Text>
          </Pressable>
        </View>

        {/* Progress summary */}
        <View style={s.summaryRow}>
          <View style={[s.summaryChip, { backgroundColor: alpha(theme.success, 0.1) }]}>
            <Text style={[s.summaryText, { color: theme.success }]}>✓ {known.size} known</Text>
          </View>
          <View style={[s.summaryChip, { backgroundColor: alpha(theme.gold, 0.1) }]}>
            <Text style={[s.summaryText, { color: theme.gold }]}>↩ {reviewing.size} to review</Text>
          </View>
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
    content: { padding: 20, gap: 16, paddingBottom: 40 },
    pillScroll: { flexGrow: 0, marginHorizontal: -20, paddingHorizontal: 20 },
    pill: {
      backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1,
      borderRadius: 999, paddingHorizontal: 16, paddingVertical: 10, marginRight: 10,
    },
    pillText: { color: theme.muted, fontSize: 13, fontWeight: '700' },
    card: {
      backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1.5,
      borderRadius: 28, padding: 28, minHeight: 260, gap: 16,
      shadowColor: theme.shadow, shadowOffset: { width: 0, height: 14 },
      shadowOpacity: 0.1, shadowRadius: 24,
    },
    cardDomain: {
      color: theme.primary, fontSize: 11, fontWeight: '800',
      letterSpacing: 1.2, textTransform: 'uppercase',
    },
    cardBody: { flex: 1, gap: 8 },
    cardSide: { color: theme.muted, fontSize: 13, fontWeight: '700' },
    cardText: { color: theme.text, fontSize: 24, fontWeight: '900', lineHeight: 32 },
    cardHint: { color: theme.muted, fontSize: 13, textAlign: 'center' },
    actionRow: { flexDirection: 'row', gap: 12 },
    actionBtn: {
      flex: 1, borderRadius: 16, paddingVertical: 16, alignItems: 'center',
      borderWidth: 1.5, backgroundColor: theme.surface,
    },
    actionBtnText: { fontSize: 15, fontWeight: '800' },
    navRow: { flexDirection: 'row', gap: 12 },
    navBtn: {
      flex: 1, borderRadius: 16, paddingVertical: 16, alignItems: 'center',
      backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1,
    },
    navBtnPrimary: { backgroundColor: theme.primary, borderColor: theme.primary },
    navBtnText: { color: theme.text, fontSize: 15, fontWeight: '700' },
    summaryRow: { flexDirection: 'row', gap: 12, justifyContent: 'center' },
    summaryChip: { borderRadius: 999, paddingHorizontal: 16, paddingVertical: 8 },
    summaryText: { fontSize: 13, fontWeight: '700' },
  });
