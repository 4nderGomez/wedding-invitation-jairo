import { MusicPlayer } from "./public/MusicPlayer.js";
import { CountdownTimer } from "./public/CountdownTimer.js";

const musicPlayer = new MusicPlayer();
musicPlayer.init();

const countdownTimer = new CountdownTimer("2026-11-21T17:00:00");
countdownTimer.init();