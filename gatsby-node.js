const path = require(`path`)

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  
  // create blog post pages
  return graphql(`
    {
      allWordpressPost(sort: { fields: [date] }) {
        edges {
          node {
            title
            excerpt
            content
            slug
          }
        }
      }
      allSermon(filter: {}, sort: {fields: preachDate, order: DESC}) {
        edges {
          node {
            preachDate
            bibleText
            downloadCount
            series {
              title
              count
            }
            slug
            fullTitle
            speaker {
              bio
              displayName
              portraitURL
              roundedThumbnailImageURL
            }
            media {
              audio {
                streamURL
                mediaType
                duration
                downloadURL
              }
            }
            id
          }
        }
      }
    }
  `).then(result => {
    result.data.allWordpressPost.edges.forEach(({ node }) => {
        createPage({
          path: `blog/${node.slug}`,
          component: path.resolve(`./src/templates/blog-post.js`),
          context: {
            // This is the $slug variable
            // passed to blog-post.js
            slug: node.slug,
          }
        });
      });
    result.data.allSermon.edges.forEach(({ node }) => {
      createPage({
        path: `sermons/${node.slug}`,
        component: path.resolve(`./src/templates/sermon.js`),
        context: {
          // This is the $slug variable
          // passed to blog-post.js
          id: node.id,
        }
      });
    })
  });
};
