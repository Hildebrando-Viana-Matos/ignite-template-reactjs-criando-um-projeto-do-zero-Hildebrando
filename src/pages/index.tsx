import { useState } from "react";
import { GetStaticProps } from "next";
import Link from "next/link";
import Prismic from "@prismicio/client";
import { getPrismicClient } from "../services/prismic";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Header from "../components/Header";
import commonStyles from "../styles/common.module.scss";
import styles from "./home.module.scss";
import Head from "next/head";

import { FiCalendar, FiUser } from "react-icons/fi";

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const formattedPost = postsPagination.results.map((post) => {
    return {
      ...post,
      first_publication_date: format(
        new Date(post.first_publication_date),
        "dd MMM yyyy",
        {
          locale: ptBR,
        }
      ),
    };
  });

  const [posts, setPosts] = useState<Post[]>(formattedPost);

  const [nextPage, setNextPage] = useState(postsPagination.next_page);
  const [currentPage, setCurrentPage] = useState(1);

  async function handleNextPage(): Promise<void> {
    if (currentPage != 1 && nextPage == null) {
      return;
    }

    const postResults = await fetch(`${nextPage}`).then((response) =>
      response.json()
    );
    setNextPage(postResults.next_page);
    setCurrentPage(postResults.page);

    const newPosts = postResults.results.map((post) => {
      return {
        uid: post.uid,
        first_publication_date: format(
          new Date(post.first_publication_date),
          "dd MMM yyyy",
          {
            locale: ptBR,
          }
        ),
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        },
      };
    });

    setPosts([...posts, ...newPosts]);
  }

  return (
    <>
      <Head>
        <title>Home | spacetraveling </title>
      </Head>

      <div className={commonStyles.container}>
        <Header />
        <main className={styles.content}>
          {posts.map((post) => (
            <div className={styles.post}>
              <div className={styles.post}>
                <Link href={`/post/${post.uid}`} key={post.uid}>
                  <a>
                    <h2>{post.data.title}</h2>
                    <p>{post.data.subtitle}</p>
                    <div className={styles.info}>
                      <span>
                        <FiCalendar /> {post.first_publication_date}
                      </span>
                      <span>
                        <FiUser /> {post.data.author}
                      </span>
                    </div>
                  </a>
                </Link>
              </div>
            </div>
          ))}

          {nextPage && (
            <button onClick={handleNextPage}>Carregar mais posts</button>
          )}
        </main>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query(
    [Prismic.Predicates.at("document.type", "publication")],
    {
      fetch: [
        "publication.title",
        "publication.subtitle",
        "publication.author",
        "publication.content",
      ],
      pageSize: 1,
    }
  );

  const posts = response.results.map((post) => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  const postsPagination = {
    next_page: response.next_page,
    results: posts,
  };

  return {
    props: {
      postsPagination,
    },
  };
};
