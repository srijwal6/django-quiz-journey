
/**
 * Format a time duration in seconds into a human-readable string
 */
export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  const parts = [];
  if (hours > 0) parts.push(`${hours} hr${hours > 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} min${minutes > 1 ? 's' : ''}`);
  if (remainingSeconds > 0 || parts.length === 0) parts.push(`${remainingSeconds} sec${remainingSeconds !== 1 ? 's' : ''}`);
  
  return parts.join(' ');
};

/**
 * Calculate grade based on percentage score
 */
export const getGrade = (score: number, total: number) => {
  const percentage = (score / total) * 100;
  if (percentage >= 90) return { grade: 'A', label: 'Excellent' };
  if (percentage >= 80) return { grade: 'B', label: 'Good' };
  if (percentage >= 70) return { grade: 'C', label: 'Satisfactory' };
  if (percentage >= 60) return { grade: 'D', label: 'Pass' };
  return { grade: 'F', label: 'Needs Improvement' };
};
