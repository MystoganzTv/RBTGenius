import { useState, useEffect, useCallback } from 'react';
import {
  Alert,
  ActivityIndicator,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

import { useAuth } from '../../context/AuthContext';
import { alpha, getTheme } from '../../theme';
import { MetricCard } from '../../components/ui';
import { setupNotifications } from '../../services/NotificationService';

const API_BASE = 'https://rbtgenius.com';
const NOTIF_KEY = 'rbt_notifications_enabled';
const LANG_KEY = 'rbt_language';

export default function ProfileScreen() {
  const scheme = useColorScheme();
  const theme = getTheme(scheme === 'dark' ? 'dark' : 'light');
  const { user, token, logout } = useAuth();
  const s = styles(theme);

  // ── Server data ────────────────────────────────────────────────
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // ── Edit modal ─────────────────────────────────────────────────
  const [editVisible, setEditVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);

  // ── Settings toggles ──────────────────────────────────────────
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [language, setLanguage] = useState('en');

  const authHeaders = { Authorization: `Bearer ${token}` };

  // Load profile + settings from server + AsyncStorage
  useEffect(() => {
    fetchProfile();
    AsyncStorage.getItem(NOTIF_KEY).then((v) => { if (v !== null) setNotificationsOn(v === 'true'); });
    AsyncStorage.getItem(LANG_KEY).then((v) => { if (v) setLanguage(v); });
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/profile`, { headers: authHeaders });
      if (res.ok) setProfile(await res.json());
    } catch { /* use auth context user as fallback */ }
    finally { setLoadingProfile(false); }
  };

  // Derived display values
  const displayName = profile?.user?.full_name ?? user?.name ?? 'Student';
  const displayEmail = profile?.user?.email ?? user?.email ?? '';
  const displayPlan = profile?.user?.plan ?? user?.plan ?? 'free';
  const progress = profile?.progress ?? {};
  const readiness = Math.round(progress.readiness_score ?? user?.readiness ?? 0);
  const streak = progress.study_streak_days ?? user?.streak ?? 0;
  const completed = progress.total_questions_completed ?? user?.completedQuestions ?? 0;

  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // ── Edit name ──────────────────────────────────────────────────
  const openEdit = () => {
    setEditName(displayName);
    setEditVisible(true);
  };

  const saveEdit = async () => {
    const name = editName.trim();
    if (!name) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/profile`, {
        method: 'PATCH',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: name }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProfile((prev) => prev ? { ...prev, user: { ...prev.user, full_name: updated.full_name } } : prev);
        setEditVisible(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Alert.alert('Error', 'Could not save changes. Try again.');
      }
    } catch {
      Alert.alert('Error', 'Network error. Check your connection.');
    } finally {
      setSaving(false);
    }
  };

  // ── Notifications toggle ───────────────────────────────────────
  const toggleNotifications = async (val) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const granted = await setupNotifications(val, token);
    // If enabling but permission denied, keep off
    const effective = val ? granted : false;
    setNotificationsOn(effective);
    AsyncStorage.setItem(NOTIF_KEY, String(effective));
    if (val && !granted) {
      Alert.alert(
        'Permisos requeridos',
        'Activa las notificaciones en Configuración → RBT Genius → Notificaciones.',
      );
    }
  };

  // ── Language toggle ───────────────────────────────────────────
  const toggleLanguage = () => {
    const next = language === 'en' ? 'es' : 'en';
    setLanguage(next);
    AsyncStorage.setItem(LANG_KEY, next);
    Alert.alert(next === 'es' ? 'Idioma cambiado' : 'Language changed', next === 'es' ? 'La app se mostrará en español.' : 'The app will display in English.');
  };

  // ── Reset progress ────────────────────────────────────────────
  const handleReset = () => {
    Alert.alert(
      'Reset all progress?',
      'This will permanently delete your question attempts, mock exam results, and readiness score. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await fetch(`${API_BASE}/api/profile/reset-progress`, {
                method: 'POST',
                headers: authHeaders,
              });
              if (res.ok) {
                const data = await res.json();
                setProfile(data);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                Alert.alert('Done', 'Your progress has been reset.');
              }
            } catch {
              Alert.alert('Error', 'Could not reset progress. Try again.');
            }
          },
        },
      ]
    );
  };

  // ── Sign out ──────────────────────────────────────────────────
  const handleLogout = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.topBar}>
        <Text style={s.screenTitle}>Profile</Text>
        <Text style={s.screenSub}>Account and preferences</Text>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* ── Avatar + info card ── */}
        <View style={s.profileCard}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{initials}</Text>
          </View>
          <View style={s.profileInfo}>
            <Text style={s.profileName}>{displayName}</Text>
            <Text style={s.profileEmail}>{displayEmail}</Text>
            <View style={[s.planBadge, { backgroundColor: alpha(theme.gold, 0.15) }]}>
              <Text style={[s.planBadgeText, { color: theme.gold }]}>
                {displayPlan === 'premium' ? 'Pro' : 'Free Plan'}
              </Text>
            </View>
          </View>
          <Pressable style={s.editBtn} onPress={openEdit}>
            <Text style={s.editBtnText}>Edit</Text>
          </Pressable>
        </View>

        {/* ── Stats grid ── */}
        {loadingProfile ? (
          <View style={s.loadingRow}>
            <ActivityIndicator color={theme.primary} />
          </View>
        ) : (
          <View style={s.metricGrid}>
            <MetricCard accent="primary" label="Readiness" value={`${readiness}%`} theme={theme} />
            <MetricCard accent="gold" label="Streak" value={`${streak} days`} theme={theme} />
            <MetricCard accent="success" label="Questions" value={completed.toLocaleString()} theme={theme} />
            <MetricCard accent="primary" label="Plan" value={displayPlan === 'premium' ? 'Pro' : 'Free'} theme={theme} />
          </View>
        )}

        {/* ── Settings card ── */}
        <View style={s.sectionLabel}><Text style={s.sectionLabelText}>Settings</Text></View>
        <View style={s.settingsCard}>

          {/* Notifications */}
          <View style={s.settingRow}>
            <View style={s.settingCopy}>
              <Text style={s.settingLabel}>Notifications</Text>
              <Text style={s.settingSub}>Daily study reminders</Text>
            </View>
            <Switch
              value={notificationsOn}
              onValueChange={toggleNotifications}
              trackColor={{ false: alpha(theme.border, 0.8), true: alpha(theme.primary, 0.4) }}
              thumbColor={notificationsOn ? theme.primary : theme.muted}
            />
          </View>

          <View style={s.divider} />

          {/* Language */}
          <Pressable style={s.settingRow} onPress={toggleLanguage}>
            <View style={s.settingCopy}>
              <Text style={s.settingLabel}>Language</Text>
              <Text style={s.settingSub}>{language === 'en' ? 'English — tap to switch to Spanish' : 'Español — tap para cambiar a inglés'}</Text>
            </View>
            <Text style={s.chevron}>›</Text>
          </Pressable>

          <View style={s.divider} />

          {/* Privacy Policy */}
          <Pressable style={s.settingRow} onPress={() => Linking.openURL('https://rbtgenius.com/privacy-policy')}>
            <View style={s.settingCopy}>
              <Text style={s.settingLabel}>Privacy Policy</Text>
              <Text style={s.settingSub}>How we handle your data</Text>
            </View>
            <Text style={s.chevron}>›</Text>
          </Pressable>

          <View style={s.divider} />

          {/* Terms */}
          <Pressable style={s.settingRow} onPress={() => Linking.openURL('https://rbtgenius.com/terms-of-service')}>
            <View style={s.settingCopy}>
              <Text style={s.settingLabel}>Terms of Service</Text>
              <Text style={s.settingSub}>Usage and legal info</Text>
            </View>
            <Text style={s.chevron}>›</Text>
          </Pressable>

        </View>

        {/* ── Danger zone ── */}
        <View style={s.sectionLabel}><Text style={s.sectionLabelText}>Danger Zone</Text></View>
        <Pressable style={s.dangerBtn} onPress={handleReset}>
          <Text style={s.dangerBtnText}>Reset All Progress</Text>
        </Pressable>

        <Pressable style={s.logoutBtn} onPress={handleLogout}>
          <Text style={s.logoutText}>Sign Out</Text>
        </Pressable>

        <Text style={s.version}>RBT Genius v1.0.0 · {displayPlan === 'premium' ? 'Pro' : 'Free'}</Text>
      </ScrollView>

      {/* ── Edit name modal ── */}
      <Modal visible={editVisible} animationType="slide" transparent presentationStyle="pageSheet">
        <View style={s.modalOverlay}>
          <View style={s.modalSheet}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Edit Profile</Text>
              <Pressable onPress={() => setEditVisible(false)}>
                <Text style={s.modalClose}>Cancel</Text>
              </Pressable>
            </View>

            <View style={s.modalBody}>
              <Text style={s.fieldLabel}>Full name</Text>
              <TextInput
                style={s.fieldInput}
                value={editName}
                onChangeText={setEditName}
                placeholder="Your full name"
                placeholderTextColor={theme.muted}
                autoCapitalize="words"
                autoFocus
              />
            </View>

            <Pressable
              style={[s.saveBtn, saving && { opacity: 0.6 }]}
              onPress={saveEdit}
              disabled={saving}
            >
              {saving
                ? <ActivityIndicator color="#fff" />
                : <Text style={s.saveBtnText}>Save Changes</Text>
              }
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = (theme) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.background },
    topBar: {
      paddingHorizontal: 20, paddingVertical: 14,
      borderBottomColor: alpha(theme.border, 0.6), borderBottomWidth: 1,
    },
    screenTitle: { color: theme.text, fontSize: 18, fontWeight: '800' },
    screenSub: { color: theme.muted, fontSize: 12, marginTop: 2 },
    content: { padding: 20, gap: 12, paddingBottom: 40 },
    profileCard: {
      backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1,
      borderRadius: 24, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 14,
    },
    avatar: {
      width: 58, height: 58, borderRadius: 18, backgroundColor: theme.primary,
      alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    },
    avatarText: { color: '#fff', fontSize: 20, fontWeight: '900' },
    profileInfo: { flex: 1, gap: 3 },
    profileName: { color: theme.text, fontSize: 17, fontWeight: '800' },
    profileEmail: { color: theme.muted, fontSize: 13 },
    planBadge: {
      alignSelf: 'flex-start', borderRadius: 999,
      paddingHorizontal: 10, paddingVertical: 3, marginTop: 3,
    },
    planBadgeText: { fontSize: 11, fontWeight: '700' },
    editBtn: {
      backgroundColor: alpha(theme.primary, 0.1), borderRadius: 10,
      paddingHorizontal: 12, paddingVertical: 7,
    },
    editBtnText: { color: theme.primary, fontSize: 13, fontWeight: '700' },
    loadingRow: { height: 80, alignItems: 'center', justifyContent: 'center' },
    metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 },
    sectionLabel: { marginTop: 8, marginBottom: 0 },
    sectionLabelText: { color: theme.muted, fontSize: 11, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' },
    settingsCard: {
      backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1,
      borderRadius: 22, overflow: 'hidden',
    },
    settingRow: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 18, paddingVertical: 15,
    },
    settingCopy: { flex: 1, gap: 2 },
    settingLabel: { color: theme.text, fontSize: 15, fontWeight: '700' },
    settingSub: { color: theme.muted, fontSize: 12 },
    chevron: { color: theme.muted, fontSize: 20 },
    divider: { height: 1, backgroundColor: alpha(theme.border, 0.6), marginHorizontal: 18 },
    dangerBtn: {
      borderColor: alpha('#EF4444', 0.5), borderWidth: 1, borderRadius: 16,
      paddingVertical: 15, alignItems: 'center', backgroundColor: alpha('#EF4444', 0.05),
    },
    dangerBtnText: { color: '#EF4444', fontSize: 15, fontWeight: '700' },
    logoutBtn: {
      borderColor: '#EF4444', borderWidth: 1.5, borderRadius: 16,
      paddingVertical: 15, alignItems: 'center',
    },
    logoutText: { color: '#EF4444', fontSize: 15, fontWeight: '700' },
    version: { color: theme.muted, fontSize: 12, textAlign: 'center', marginTop: 4 },
    // Modal
    modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
    modalSheet: {
      backgroundColor: theme.background, borderTopLeftRadius: 28, borderTopRightRadius: 28,
      padding: 24, paddingBottom: 48, gap: 20,
    },
    modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    modalTitle: { color: theme.text, fontSize: 18, fontWeight: '800' },
    modalClose: { color: theme.muted, fontSize: 15 },
    modalBody: { gap: 8 },
    fieldLabel: { color: theme.text, fontSize: 14, fontWeight: '700' },
    fieldInput: {
      backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1,
      borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
      color: theme.text, fontSize: 16,
    },
    saveBtn: {
      backgroundColor: theme.primary, borderRadius: 16,
      paddingVertical: 16, alignItems: 'center',
    },
    saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  });
