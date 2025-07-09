import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import client from './contentfulClient';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS } from '@contentful/rich-text-types';
import './BlogDetail.css';

interface Sys {
  id: string;
}

interface ImageFields {
  title?: string;
  file?: {
    url?: string;
    contentType?: string;
  };
}

interface PostFields {
  title?: string;
  body?: any;
  description?: string;
  publishDate?: string;
  coverImage?: {
    fields?: ImageFields;
  };
  images?: Array<{
    sys: Sys;
    fields: ImageFields;
  }>;
}

interface Post {
  fields: PostFields;
}

export default function BlogDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (!id) return;
    client.getEntry(id).then((entry: Post) => {
      setPost(entry);
    });
  }, [id]);

  if (!post) return <p>Loading...</p>;

  const { title, body, publishDate, coverImage, images, description } = post.fields;

  const renderOptions = {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
        const { file, title } = node.data.target.fields || {};
        const url = file?.url ? `https:${file.url}` : '';
        if (!url) return null;
        if (file.contentType && file.contentType.startsWith('image/')) {
          return (
              <img
                src={url}
                alt={title || ''}
                className="embedded-image"
              />
          );
        }
        return null;
      },
    },
  };

  return (
    <div className="detail-container">
      {coverImage?.fields?.file?.url && (
        <img
          src={`https:${coverImage.fields.file.url}`}
          alt={title}
          className="cover-image"
        />
      )}
      <h1 className="detail-title">{title}</h1>
      <p className="detail-date">
        Published {publishDate ? new Date(publishDate).toDateString() : ''}
      </p>
      <h3 className="detail-description">{description}</h3>
      <div className="prose">
        {documentToReactComponents(body, renderOptions)}
      </div>

      <div className="detail-images">
        {images &&
          images.map((img) => (
            <img
              key={img.sys.id}
              src={`https:${img.fields.file?.url ?? ''}`}
              alt={img.fields.title ?? ''}
              className="detail-image"
            />
          ))}
      </div>
    </div>
  );
}
