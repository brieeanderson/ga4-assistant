// Utility functions for generating anchor links and table of contents

export function generateAnchorId(text) {
  if (!text || typeof text !== 'string') return '';
  
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

export function extractTextFromChildren(children) {
  if (typeof children === 'string') {
    return children;
  }
  
  if (Array.isArray(children)) {
    return children.map(child => extractTextFromChildren(child)).join('');
  }
  
  if (children && children.props && children.props.children) {
    return extractTextFromChildren(children.props.children);
  }
  
  return '';
}

// Extract headings from Contentful rich text content for TOC
export function extractHeadings(content) {
  const headings = [];
  
  if (!content || !content.content || !Array.isArray(content.content)) {
    return headings;
  }
  
  function traverse(nodes) {
    nodes.forEach(node => {
      if (node.nodeType === 'heading-1' || node.nodeType === 'heading-2' || node.nodeType === 'heading-3' || node.nodeType === 'heading-4') {
        const text = extractTextFromNode(node);
        if (text) {
          headings.push({
            id: generateAnchorId(text),
            text: text,
            level: parseInt(node.nodeType.split('-')[1])
          });
        }
      }
      
      if (node.content && Array.isArray(node.content)) {
        traverse(node.content);
      }
    });
  }
  
  traverse(content.content);
  return headings;
}

function extractTextFromNode(node) {
  if (!node.content || !Array.isArray(node.content)) {
    return '';
  }
  
  return node.content.map(child => {
    if (child.nodeType === 'text') {
      return child.value || '';
    }
    if (child.content) {
      return extractTextFromNode(child);
    }
    return '';
  }).join('');
}
