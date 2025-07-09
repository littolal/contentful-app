import { useEffect, useState } from 'react';
import client from './contentfulClient';
import { Link } from 'react-router-dom';
import './BlogList.css';

interface Sys {
  id: string;
}

interface ImageFields {
  file?: {
    url?: string;
  };
}

interface PostFields {
  title?: string;
  description?: string;
  coverImage?: {
    fields?: ImageFields;
  };
}

interface Post {
  sys: Sys;
  fields: PostFields;
}

export default function BlogList() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    client.getEntries({ content_type: 'blogPostHd' }).then((response: any) => {
      setPosts(response.items as Post[]);
    });
  }, []);

  return (
    <div className="listing-grid">
      {posts.map((post) => {
        const title = post.fields.title ?? 'Untitled';
        const imageUrl = post.fields.coverImage?.fields?.file?.url;
        const description =post.fields.description ?? 'No description available';
        return (
          <Link className="listing-item" key={post.sys.id} to={`/blog/${post.sys.id}`}>
            <div>
              {imageUrl && (
                <img src={`https:${imageUrl}`} alt={title} className="listing-image" />
              )}
              <h2 className="listing-title">{title}</h2>
              <p className="listing-description">{description}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
