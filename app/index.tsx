import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Font from "expo-font";
import { Pedometer } from "expo-sensors";
import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const initialCreature = {
  name: "Borat",
  stage: 1,
  requiredSteps: 10,
  nextName: "Ranburat",
  imageKey: "Borat",
};
const STORAGE_KEY = "gameState";

export default function Index() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [status, setStatus] = useState<string>("checking...");
  const [steps, setSteps] = useState(0);
  const [creature, setCreature] = useState(initialCreature);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "PKMN RBYGSC": require("../assets/fonts/PKMN RBYGSC.ttf"),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  useEffect(() => {
    let subscription: { remove: () => void } | null = null;
    async function loadGameState() {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const saved = JSON.parse(raw) as {
          creature: typeof initialCreature;
          steps: number;
        };
        if (saved?.creature) {
          setCreature({
            ...saved.creature,
            imageKey: saved.creature.name as any,
          });
        }
        if (typeof saved?.steps === "number") {
          setSteps(saved.steps);
        }
      } catch (error) {
        console.warn("Failed to load the game State", error);
      }
    }

    async function subscribe() {
      const permission = await Pedometer.requestPermissionsAsync();
      if (!permission.granted) return setStatus("permission denied");
      const available = await Pedometer.isAvailableAsync();
      setStatus(available ? "available" : "not available");
      subscription = Pedometer.watchStepCount((result) => {
        setSteps((prev) => prev + result.steps);
      });
    }
    loadGameState();
    subscribe();
    return () => {
      subscription?.remove();
    };
  }, []);
  useEffect(() => {
    async function saveGameState(): Promise<void> {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ creature, steps }),
        );
      } catch (error) {
        console.warn("Failed to save game state", error);
      }
    }
    saveGameState();
  }, [creature, steps]);

  const xp = steps;
  const progress = Math.min(xp / creature.requiredSteps, 1);

  const progressLabel = `${xp}/${creature.requiredSteps} XP`;

  const handleEvolve = () => {
    if (xp < creature.requiredSteps) return;
    const newName = creature.stage === 1 ? "Ranburat" : "Ultraburat";
    setCreature((current) => ({
      name: newName,
      stage: current.stage + 1,
      requiredSteps: current.requiredSteps + 20,
      nextName: current.stage === 1 ? "Ultraburat" : "Ultraburat",
      imageKey: newName,
    }));
    setSteps(0);
  };

  const handleReset = () => {
    setCreature(initialCreature);
    setSteps(0);
  };

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <View />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Image
            source={
              imageMap[creature.imageKey as keyof typeof imageMap] ||
              imageMap.Borat
            }
            style={styles.creatureImage}
          />
          <View style={styles.headerText}>
            <Text style={styles.heading}>{creature.name}</Text>
            <Text style={styles.stage}>Lv.{creature.stage}</Text>
            <Text style={styles.status}>Status: {status}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.statsContainer}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>XP</Text>
            <Text style={styles.statValue}>{progressLabel}</Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[styles.progressFill, { width: `${progress * 100}%` }]}
            />
          </View>

          <View style={styles.statRow}>
            <Text style={styles.nextEvo}>→ {creature.nextName}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Pressable
          style={[
            styles.button,
            xp >= creature.requiredSteps
              ? styles.buttonActive
              : styles.buttonDisabled,
          ]}
          onPress={handleEvolve}
          disabled={xp < creature.requiredSteps}
        >
          <Text style={styles.buttonText}>
            {xp >= creature.requiredSteps ? "⚡ EVOLVE NOW" : "🚶 KEEP WALKING"}
          </Text>
        </Pressable>

        <Pressable style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>RESET</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#16213e",
    borderWidth: 3,
    borderColor: "#ffd700",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  header: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
  },
  creatureImage: {
    width: 100,
    height: 100,
    marginRight: 16,
    borderRadius: 8,
  },
  headerText: {
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: "800",
    color: "#ffd700",
    marginBottom: 4,
    fontFamily: "PKMN RBYGSC",
    letterSpacing: 1,
  },
  stage: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ff6b6b",
    marginBottom: 8,
    fontFamily: "PKMN RBYGSC",
  },
  status: {
    fontSize: 12,
    color: "#a8dadc",
    fontFamily: "PKMN RBYGSC",
  },
  divider: {
    height: 2,
    backgroundColor: "#ffd700",
    marginVertical: 14,
    borderRadius: 1,
  },
  statsContainer: {
    marginBottom: 4,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffd700",
    fontFamily: "PKMN RBYGSC",
  },
  statValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    fontFamily: "PKMN RBYGSC",
  },
  nextEvo: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ff6b6b",
    fontFamily: "PKMN RBYGSC",
  },
  progressTrack: {
    width: "100%",
    height: 16,
    backgroundColor: "#0f3460",
    borderRadius: 4,
    overflow: "hidden",
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ffd700",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6ee7b7",
  },
  button: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 2,
    marginTop: 4,
  },
  buttonActive: {
    backgroundColor: "#ffd700",
    borderColor: "#ff6b6b",
  },
  buttonDisabled: {
    backgroundColor: "#0f3460",
    borderColor: "#a8dadc",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#16213e",
    fontFamily: "PKMN RBYGSC",
    letterSpacing: 1,
  },
  resetButton: {
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#a8dadc",
    backgroundColor: "transparent",
  },
  resetButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#a8dadc",
    fontFamily: "PKMN RBYGSC",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    color: "#aac4e3",
  },
  value: {
    color: "#fff",
    fontWeight: "600",
  },
  goal: {
    color: "#cbd6eb",
    marginTop: 14,
    marginBottom: 18,
  },
});
const imageMap = {
  Borat: require("../assets/images/Rat/Borat.png"),
  Ranburat: require("../assets/images/Rat/Ranburat.png"),
  Ultraburat: require("../assets/images/Rat/Ultraburat.png"),
};
