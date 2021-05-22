import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";
import { GetStaticProps, GetStaticPaths } from "next";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { api } from "../../services/api";

import styles from "./episode.module.scss";
import { usePlayer } from "../../contexts/PlayerContext";
import { useTheme } from "../../contexts/ThemeContext";

type Episode = {
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  thumbnail: string;
  duration: number;
  durationAsString: string;
  url: string;
  description: string;
};

type EpisodeProps = {
  episode: Episode;
};

export default function Episode({ episode }: EpisodeProps) {
  const { play } = usePlayer();
  const { isDark } = useTheme();

  return (
    <div
      className={
        isDark
          ? `${styles.episodeContainer} ${styles.dark}`
          : styles.episodeContainer
      }
    >
      <div className={styles.episode}>
        <Head>
          <title>{episode.title} | Podcastr</title>
        </Head>

        <div className={styles.thumbnailContainer}>
          <Link href="/">
            <button type="button">
              <img src="/arrow-left.svg" alt="Voltar" />
            </button>
          </Link>
          <Image
            height={160}
            width={700}
            src={episode.thumbnail}
            objectFit="cover"
            layout="intrinsic"
          />
          <button type="button" onClick={() => play(episode)}>
            <img src="/play.svg" alt="Tocar episódio" />
          </button>
        </div>

        <header>
          <h1>{episode.title}</h1>
          <p>
            <span className={styles.members}>{episode.members}</span>
            <span className={styles.published}>{episode.publishedAt}</span>
            <span className={styles.duration}>{episode.durationAsString}</span>
          </p>
        </header>

        <div
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: episode.description }}
        />
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get("episodes", {
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc",
    },
  });

  const paths = data.map((episode) => {
    return {
      params: {
        slug: episode.id,
      },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;

  const { data } = await api.get(`/episodes/${slug}`);

  const episode = {
    id: data.id,
    title: data.title,
    members: data.members,
    thumbnail: data.thumbnail,
    publishedAt: format(parseISO(data.published_at), "d MMM yy", {
      locale: ptBR,
    }),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file.url,
  };

  return {
    props: {
      episode,
    },

    revalidate: 60 * 60 * 24,
  };
};
