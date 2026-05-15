# 🐾 Walking Evolution App (MVP)

A gamified fitness tracking mobile app where users walk in real life to grow and evolve virtual creatures (Pokémon-style progression system).

---

# 🎯 Goal

Build an **offline-first mobile game + fitness tracker** where:

Walk → Gain Steps → Earn XP → Evolve Creature → Repeat

---

# 📱 Core Features (MVP)

## 👣 Step Tracking

- Live step counting using device sensors (Expo Sensors)
- Real-time updates while walking
- Converts steps into XP

---

## 🐾 Creature System

- User selects an active creature
- Creatures have multiple evolution stages
- Evolution is based on step milestones

Example:
Pichu → Pikachu → Raichu

---

## 📈 Progress System

- Steps convert into XP
- Progress bar per creature
- Evolution triggers when threshold is reached

Example:
if currentSteps >= requiredSteps → evolve

---

## 💾 Offline First

- Works without internet
- Stores locally:
  - steps
  - creature progress
  - evolution state
- Uses SQLite

---

## 🔄 Cloud Sync (Later)

- Sync when internet is available
- Backup user progress
- Enable global leaderboards

Powered by Supabase

---

## 🏆 Leaderboards (Future)

- Daily / weekly rankings
- Global competition
- Anti-cheat validation via backend logic

---

# 🧠 System Architecture

Mobile App (Expo)
↓
Local Database (SQLite)
↓
Supabase API (Cloud Sync)
↓
Supabase Edge Functions (Backend Logic)

---

# 📁 Folder Structure

app/ → UI screens (Expo Router)
components/ → reusable UI components
features/ → game logic (steps, creatures, evolution)
store/ → Zustand state management
hooks/ → custom React hooks
utils/ → helper functions
types/ → TypeScript types
constants/ → static game data
database/ → SQLite logic
assets/ → images, animations, sounds

backend/
supabase/
functions/
daily-reset/
update-leaderboard/
validate-steps/

shared/
game-rules/
xpCalculator.ts
evolutionRules.ts
stepRules.ts

---

# 🧠 Game Logic

## XP System

1 step = 1 XP (MVP rule)

---

## Evolution System

if currentSteps >= requiredSteps:
→ evolve creature

Supports multiple evolution stages.

---

## Daily Reset (Backend)

- Resets daily steps
- Keeps lifetime progress
- Maintains streak system (future feature)

---

# 💾 Data Model (ERD Summary)

User

- id
- username
- total_steps
- active_creature_id

Creature

- id
- name
- stage
- next_creature_id
- required_steps

UserCreature

- id
- user_id
- creature_id
- current_steps
- current_stage
- is_active

StepHistory

- id
- user_id
- date
- steps
- calories
- distance

---

# ⚙️ Tech Stack

## Mobile

- Expo
- React Native
- TypeScript
- Expo Router

## State

- Zustand

## Storage

- SQLite (offline)
- AsyncStorage (cache)

## Backend

- Supabase
- Supabase Edge Functions

## UI

- NativeWind
- Reanimated
- Lottie

## Sensors

- Expo Sensors

---

# 🚀 Roadmap

## Phase 1

- Step tracking
- XP system
- Creature selection
- Evolution system

## Phase 2

- Offline persistence (SQLite)

## Phase 3

- Supabase sync
- Cloud backup

## Phase 4

- Backend logic (daily reset, leaderboard)

## Phase 5

- Animations, polish, UX improvements

---

# ⚠️ Rules

- Must work offline first
- Core gameplay must be local
- Backend only handles sync + validation
- Avoid overengineering MVP

---

# 🎮 Vision

A real-world fitness RPG where:

Walking becomes progression  
Progress becomes evolution  
Evolution becomes motivation

---

# 🧠 Core Principle

Build the smallest working loop first, then expand.
