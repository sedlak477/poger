import { GuildMember, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../commands.js";
import ytdl from "ytdl-core";
import { createAudioPlayer, createAudioResource, demuxProbe, NoSubscriberBehavior, joinVoiceChannel, getVoiceConnection, VoiceConnection, VoiceConnectionStatus, AudioPlayerStatus } from "@discordjs/voice";

const play: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play audio from a YouTube video.")
    .setDMPermission(false)
    .addStringOption(option => option.setName("url").setDescription("URL of the YouTube video.").setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply();
    const url = interaction.options.getString("url");

    const info = await ytdl.getBasicInfo(url);

    const ytStream = ytdl(url, {
      quality: "highestaudio",
      filter: "audioonly",
      dlChunkSize: 0,
    });

    ytStream.on("error", error => {
      console.log("ytdl stream error:");
      console.log(error);
    })

    const { stream, type } = await demuxProbe(ytStream);

    stream.on("error", error => {
      console.log("Demux stream error:");
      console.log(error);
    })

    const audioResource = createAudioResource(stream, { inputType: type, inlineVolume: true });
    audioResource.volume.setVolume(0.1);

    const audioPlayer = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Pause } });

    let connection = getVoiceConnection(interaction.guildId);

    if (!connection || connection.state.status !== VoiceConnectionStatus.Ready) {
      connection?.destroy();

      connection = joinVoiceChannel({
        channelId: (interaction.member as GuildMember).voice.channelId,
        guildId: interaction.guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator
      });
    } else {
      console.log("Reusing existing connection.");
    }

    connection.on('stateChange', (oldState, newState) => {
      console.log(`Connection transitioned from ${oldState.status} to ${newState.status}.`);
    });

    audioPlayer.on("error", error => {
      audioPlayer.stop();
      connection.destroy();
      console.error("Error playing audio resource.");
      console.log(error);
    });

    connection.on(VoiceConnectionStatus.Ready, async () => {
      connection.subscribe(audioPlayer);

      audioPlayer.play(audioResource);
      await interaction.editReply(`Playing ${info.videoDetails.title}`);
    });

    audioPlayer.once(AudioPlayerStatus.AutoPaused, () => {
      console.log("Player paused because no listeners.");
    });

    audioPlayer.once(AudioPlayerStatus.Buffering, () => {
      console.log("Player buffering.");
    });

    audioPlayer.once(AudioPlayerStatus.Idle, () => {
      console.log("Player idle.");
    });
  },
};

export default play;
