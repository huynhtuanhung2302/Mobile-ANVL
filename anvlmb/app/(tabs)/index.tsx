import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions, FlatList, Image, Animated } from 'react-native';
import { useAppTheme } from '@/ctx/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useMission } from '@/ctx/MissionContext';
import { useAlertQueue } from '@/ctx/AlertQueueContext';
import { usePatrol, PatrolStatus } from '@/ctx/PatrolContext';
import ActiveMissionBanner from '@/components/ActiveMissionBanner';

const { width } = Dimensions.get('window');

// Status Mapping for UI
const STATUS_LABELS: Record<string, string> = {
  'UNPROCESSED': 'Chờ tiếp nhận',
  'RECEIVED': 'Đã tiếp nhận',
  'REPORTED': 'Đã báo cáo',
  'FINISHED': 'Kết thúc'
};

const STATUS_COLORS: Record<string, string> = {
  'UNPROCESSED': '#FF3B30', // Danger red
  'RECEIVED': '#FF9500',    // Alert orange
  'REPORTED': '#0A84FF',    // Bio blue
  'FINISHED': '#34C759'     // Tactical green
};

// Mock Alert Data for Carousel
// ... (Alerts are stays as is for now)


export default function HomeScreen() {
  const { colors, colorScheme } = useAppTheme();
  const { injectAlert } = useMission();
  const { queue } = useAlertQueue();
  const { routes } = usePatrol();
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  // Mock "Today" date for comparison (Current Local Time: 2026-02-03)
  const TODAY = '2026-02-03';
  const TOMORROW = '2026-02-04';

  // Test state to cycle through patrol hero scenarios
  const [patrolTestMode, setPatrolTestMode] = React.useState<PatrolStatus | 'DEFAULT'>('DEFAULT');

  // Logic to select "Hero" Patrol Routes (Highest Available Category only)
  const getHeroRoutes = () => {
    // If testing: Return only filtered items for TODAY to avoid mixing today/tomorrow
    if (patrolTestMode === 'ĐANG THỰC HIỆN') return routes.filter((r: any) => r.date === TODAY && r.status === 'ĐANG THỰC HIỆN');
    if (patrolTestMode === 'CHƯA THỰC HIỆN') return routes.filter((r: any) => r.date === TODAY && r.status === 'CHƯA THỰC HIỆN');
    if (patrolTestMode === 'HOÀN THÀNH') return []; // PER USER: No finished patrols on Dashboard

    // Default logic: Priority Today > Tomorrow
    const todayOngoing = routes.filter(r => r.date === TODAY && r.status === 'ĐANG THỰC HIỆN');
    const todayUpcoming = routes.filter(r => r.date === TODAY && r.status === 'CHƯA THỰC HIỆN');
    const tomorrowUpcoming = routes.filter(r => r.date === TOMORROW && r.status === 'CHƯA THỰC HIỆN');

    // Strategy: Always show ongoing. If none, show today's upcoming.
    // REFINED: Only show tomorrow's schedule when today is cleared (No pending/ongoing)
    // HIDDEN: Finished/Reported today's patrols are no longer shown on Dashboard.
    let displayList: any[] = [];

    if (todayOngoing.length > 0) {
      displayList = [...todayOngoing];
    } else if (todayUpcoming.length > 0) {
      displayList = [...todayUpcoming];
    } else if (tomorrowUpcoming.length > 0) {
      displayList = [...tomorrowUpcoming];
    }

    // Filter out finished/reported to keep UI clean
    return displayList.filter(r => r.status !== 'HOÀN THÀNH' && r.status !== 'ĐÃ BÁO CÁO').slice(0, 4);
  };

  const heroRoutes = getHeroRoutes();

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const styles = dynamicStyles(colors, colorScheme);

  const handlePress = (target: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(target as any);
  };

  const cyclePatrolTest = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (patrolTestMode === 'DEFAULT') setPatrolTestMode('ĐANG THỰC HIỆN');
    else if (patrolTestMode === 'ĐANG THỰC HIỆN') setPatrolTestMode('CHƯA THỰC HIỆN');
    else setPatrolTestMode('DEFAULT');
  };

  const renderAlertItem = ({ item }: { item: any }) => {
    // Check if this alert exists in our real queue
    const liveAlert = queue.find(a => a.id === item.id);
    const displayStatus = liveAlert?.status || item.status || 'UNPROCESSED';

    return (
      <TouchableOpacity
        style={styles.alertCard}
        onPress={() => router.push({
          pathname: '/alert-detail',
          params: {
            incidentId: item.id,
            alertType: item.type,
            severity: item.severity,
            status: displayStatus
          }
        } as any)}
      >
        <Animated.View style={[
          styles.neonBorder,
          {
            borderColor: item.severity === 'Khẩn cấp' ? colors.danger : colors.warning,
            opacity: pulseAnim.interpolate({ inputRange: [1, 1.1], outputRange: [0.3, 0.8] })
          }
        ]} />
        <Image source={{ uri: item.image }} style={styles.alertThumb} />
        <View style={styles.alertOverlay}>
          <View style={[styles.severityBadge, { backgroundColor: item.severity === 'Khẩn cấp' ? colors.danger : colors.warning }]}>
            <Text style={styles.severityText}>{item.severity.toUpperCase()}</Text>
          </View>

          {/* Status Badge */}
          <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[displayStatus] }]}>
            <Text style={styles.statusBadgeText}>{STATUS_LABELS[displayStatus].toUpperCase()}</Text>
          </View>

          <Text style={styles.alertType}>{item.type}</Text>
          <Text style={styles.alertLoc}>{item.location}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ActiveMissionBanner />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Chào buổi sáng,</Text>
            <Text style={styles.userName}>Nhân viên 042</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.testButton}
              onPress={cyclePatrolTest}
            >
              <Ionicons
                name={patrolTestMode === 'DEFAULT' ? "bug-outline" : "flask"}
                size={22}
                color={patrolTestMode === 'DEFAULT' ? colors.muted : colors.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={() => handlePress('/(tabs)/profile')}
            >
              <Ionicons name="person-circle-outline" size={48} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>


        {/* Alert Status Grid - NOW 2x2 LAYOUT */}
        <View style={styles.statusSection}>
          <Text style={styles.sectionTitle}>Tổng hợp tin cảnh báo</Text>
          <View style={styles.subGrid}>
            <TouchableOpacity
              style={[styles.smallWidget, styles.activeTaskWidget]}
              onPress={() => router.push({ pathname: '/(tabs)/alerts', params: { tab: 'RECEIVED' } } as any)}
            >
              <Text style={[styles.smallValue, { color: colors.danger }]}>
                {queue.filter(a => a.status === 'RECEIVED').length.toString().padStart(2, '0')}
              </Text>
              <View style={styles.labelContainer}>
                <Text style={styles.smallLabel}>Đã tiếp nhận</Text>
              </View>
              <View style={[styles.indicator, { backgroundColor: colors.danger }]} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.smallWidget}
              onPress={() => router.push({ pathname: '/(tabs)/alerts', params: { tab: 'UNPROCESSED' } } as any)}
            >
              <Text style={[styles.smallValue, { color: colors.warning }]}>
                {queue.filter(a => a.status === 'UNPROCESSED').length.toString().padStart(2, '0')}
              </Text>
              <View style={styles.labelContainer}>
                <Text style={styles.smallLabel}>Chờ tiếp nhận</Text>
              </View>
              <View style={[styles.indicator, { backgroundColor: colors.warning }]} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.smallWidget}
              onPress={() => router.push({ pathname: '/(tabs)/alerts', params: { tab: 'REPORTED' } } as any)}
            >
              <Text style={[styles.smallValue, { color: colors.primary }]}>
                {queue.filter(a => a.status === 'REPORTED').length.toString().padStart(2, '0')}
              </Text>
              <View style={styles.labelContainer}>
                <Text style={styles.smallLabel}>Đã báo cáo</Text>
              </View>
              <View style={[styles.indicator, { backgroundColor: colors.primary }]} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.smallWidget}
              onPress={() => router.push({ pathname: '/(tabs)/alerts', params: { tab: 'FINISHED' } } as any)}
            >
              <Text style={[styles.smallValue, { color: colors.safe }]}>
                {queue.filter(a => a.status === 'FINISHED').length.toString().padStart(2, '0')}
              </Text>
              <View style={styles.labelContainer}>
                <Text style={styles.smallLabel}>Kết thúc</Text>
              </View>
              <View style={[styles.indicator, { backgroundColor: colors.safe }]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick-Look Mini Map Widget */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Nhận diện khu vực</Text>
        <TouchableOpacity
          style={styles.mapWidget}
          onPress={() => handlePress('/(tabs)/map')}
        >
          <View style={styles.mapPlaceholder}>
            <Image
              source={{ uri: 'https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/106.7018,10.7765,14,0/600x300?access_token=pk.eyJ1IjoibW9ja2VydSIsImEiOiJjbTVoN3Qyam0wMXJpMmpzNDB4MThnaXp4In0.rL8O6E7v6E8Z9R5Rk8vG7A' }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.mapOverlay}>
              <View style={styles.userMarker}>
                <Animated.View style={[styles.userPulse, { transform: [{ scale: pulseAnim }] }]} />
                <View style={styles.userDot} />
              </View>
              <View style={styles.mapBadge}>
                <Ionicons name="map-outline" size={14} color="white" />
                <Text style={styles.mapBadgeText}>MỞ BẢN ĐỒ</Text>
              </View>
            </View>
          </View>
          <View style={styles.mapInfo}>
            <Text style={styles.locationMain}>Khu vực B - Nhà Điều Hành</Text>
            <Text style={styles.locationSub}>2 cảnh báo gần bạn (trong 200m)</Text>
          </View>
        </TouchableOpacity>

        {/* Operational Widgets Grid (STACKED VERTICALLY) */}
        <View style={styles.opGrid}>
          {heroRoutes.map((route: any) => (
            <TouchableOpacity
              key={route.id}
              style={[
                styles.heroWidget,
                route.status === 'ĐANG THỰC HIỆN' && styles.heroActiveBorder
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                if (route.status === 'ĐANG THỰC HIỆN') {
                  router.push({
                    pathname: '/patrol-details',
                    params: { routeId: route.id, routeName: route.name }
                  } as any);
                } else if (route.status === 'HOÀN THÀNH') {
                  router.push({
                    pathname: '/patrol-report',
                    params: { routeId: route.id, routeName: route.name }
                  } as any);
                } else if (route.status === 'ĐÃ BÁO CÁO') {
                  router.push({
                    pathname: '/patrol-history-detail',
                    params: { routeId: route.id, routeName: route.name }
                  } as any);
                }
              }}
            >
              <View style={[styles.heroHeader, { alignItems: 'flex-start' }]}>
                <View style={{ flexDirection: 'row', flex: 1, marginRight: 12 }}>
                  <View style={[
                    styles.heroIcon,
                    { backgroundColor: (route.status === 'ĐANG THỰC HIỆN' ? colors.primary : colors.muted) + '20' }
                  ]}>
                    <Ionicons
                      name={route.status === 'HOÀN THÀNH' ? "checkmark-circle" : "shield-half"}
                      size={24}
                      color={route.status === 'HOÀN THÀNH' ? colors.safe : route.status === 'ĐANG THỰC HIỆN' ? colors.primary : colors.muted}
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.heroTitle}>
                      {route.date === TOMORROW ? 'LỊCH NGÀY MAI' : 'LỊCH TUẦN TRA'}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                      <Text style={{ color: colors.text, fontSize: 14, fontWeight: 'bold' }}>{route.name}</Text>
                    </View>
                  </View>
                </View>

                <View style={[
                  styles.heroBadge,
                  { backgroundColor: (route.status === 'HOÀN THÀNH' ? colors.safe : route.status === 'ĐANG THỰC HIỆN' ? colors.primary : colors.warning) + '15' }
                ]}>
                  {route.status === 'ĐANG THỰC HIỆN' && (
                    <Animated.View style={[styles.statusDot, { backgroundColor: colors.primary, transform: [{ scale: pulseAnim }] }]} />
                  )}
                  <Text style={[
                    styles.heroBadgeText,
                    { color: route.status === 'HOÀN THÀNH' ? colors.safe : route.status === 'ĐANG THỰC HIỆN' ? colors.primary : colors.warning }
                  ]}>
                    {route.status}
                  </Text>
                </View>
              </View>
              <View style={styles.heroMain}>
                <View>
                  <Text style={styles.heroValue}>{route.time}</Text>
                  {route.status === 'HOÀN THÀNH' && <Text style={{ color: colors.muted, fontSize: 11, marginTop: 4 }}>Ca làm việc đã kết thúc</Text>}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>


    </View>
  );
}

const dynamicStyles = (colors: any, scheme: string) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.base,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '500',
  },
  userName: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800', // Dynamic Typo: Extra bold
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  testButton: {
    padding: 10,
    backgroundColor: colors.danger + '15',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.danger + '30',
  },
  avatarContainer: {
    borderRadius: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.muted
  },
  seeAll: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  carouselContainer: {
    paddingBottom: 24,
  },
  alertCard: {
    width: width * 0.75,
    height: 180,
    marginRight: 16,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    // Glassmorphism effect
    borderWidth: 1,
    borderColor: colors.text + '15',
  },
  alertThumb: {
    width: '100%',
    height: '100%',
  },
  alertOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 16,
    justifyContent: 'flex-end',
  },
  severityBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  severityText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  statusBadgeText: {
    color: 'white',
    fontSize: 9,
    fontWeight: '900',
  },
  alertType: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  alertLoc: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  mapWidget: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: colors.text + '10',
    // Glassmorphism
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  mapPlaceholder: {
    height: 160,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,10,30,0.2)',
  },
  userMarker: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userPulse: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '40',
  },
  userDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: 'white',
  },
  mapBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  mapBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '800',
  },
  mapInfo: {
    padding: 16,
  },
  locationMain: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  locationSub: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 4,
  },
  emergencySection: {
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  neonBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 2,
    borderRadius: 24,
    zIndex: 1,
  },
  statusSection: {
    marginBottom: 8,
  },
  criticalWidget: {
    borderColor: colors.danger + '40',
    borderWidth: 1.5,
  },
  glowOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.danger,
    borderRadius: 20,
  },
  opGrid: {
    gap: 16,
  },
  heroWidget: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.text + '10',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  heroBadgeText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  heroMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  heroValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  subGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  smallWidget: {
    width: (width - 52) / 2, // 2 widgets per row
    height: 90, // Taller widgets
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.text + '08',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  smallValue: {
    color: colors.text,
    fontSize: 28, // Multi-size
    fontWeight: '900',
    marginBottom: 4,
  },
  smallLabel: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  subSmallLabel: {
    color: colors.muted,
    fontSize: 8,
    fontWeight: '700',
    marginTop: 2,
    opacity: 0.6,
  },
  labelContainer: {
    marginTop: 2,
  },
  activeTaskWidget: {
    borderColor: colors.danger + '30',
    borderWidth: 1.5,
  },
  heroActiveBorder: {
    borderColor: colors.primary + '40',
    borderWidth: 1.5,
  },
  indicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 4,
    opacity: 0.8,
  },
});

