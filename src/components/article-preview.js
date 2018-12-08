import React from 'react'
import Link from 'gatsby-link'
import Img from 'gatsby-image'

import styles from './article-preview.module.css'

export default ({ article }) => {
  const renderTags = () => {
    return article.tags.map(tag => tag).join(', ')
  }
  return (
    <div className={styles.preview}>
      {article.heroImage && (
        <Img alt="" sizes={article.heroImage.sizes} />
      )}
      <h3 className={styles.previewTitle}>
        <Link to={`/blog/${article.slug}`}>{article.title}</Link>
      </h3>
      <small>{article.publishDate} </small>
      <small>Tags: {renderTags()}</small>
      <p
        dangerouslySetInnerHTML={{
          __html: article.description.childMarkdownRemark.html
        }}
      />
    </div>
  );
}
