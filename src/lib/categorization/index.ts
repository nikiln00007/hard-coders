// ============================================================
// Rule-based Auto-Categorization Engine
// ============================================================
import type { ExpenseCategory } from '../../types';

interface CategoryRule {
  keywords: string[];
  category: ExpenseCategory;
}

const CATEGORY_RULES: CategoryRule[] = [
  {
    keywords: ['swiggy', 'zomato', 'dominos', 'pizza hut', 'mcdonalds', 'kfc', 'burger king', 'restaurant', 'cafe', 'food court', 'biryani', 'dining'],
    category: 'Food & Dining',
  },
  {
    keywords: ['bigbasket', 'blinkit', 'dmart', 'zepto', 'jiomart', 'grofers', 'vegetables', 'grocery', 'milk', 'provisions', 'supermarket', 'more supermarket'],
    category: 'Groceries',
  },
  {
    keywords: ['uber', 'ola', 'rapido', 'metro', 'petrol', 'diesel', 'fuel', 'irctc', 'bus ticket', 'redbus', 'flight', 'indigo', 'vistara', 'parking', 'toll', 'fastag'],
    category: 'Transport',
  },
  {
    keywords: ['amazon', 'flipkart', 'myntra', 'ajio', 'meesho', 'snapdeal', 'nykaa', 'tata cliq', 'shopping', 'clothes', 'shoes', 'fashion'],
    category: 'Shopping',
  },
  {
    keywords: ['rent', 'housing', 'apartment', 'flat', 'maintenance', 'society', 'pg', 'hostel'],
    category: 'Rent & Housing',
  },
  {
    keywords: ['electricity', 'water bill', 'gas bill', 'broadband', 'wifi', 'internet', 'airtel', 'jio', 'vi ', 'vodafone', 'bsnl', 'phone bill', 'recharge', 'dth'],
    category: 'Utilities',
  },
  {
    keywords: ['coursera', 'udemy', 'unacademy', 'byju', 'college', 'tuition', 'school', 'book', 'stationery', 'exam', 'education'],
    category: 'Education',
  },
  {
    keywords: ['pharmacy', 'medical', 'hospital', 'doctor', 'clinic', 'apollo', 'medplus', 'medicine', 'health', 'gym', 'fitness'],
    category: 'Health',
  },
  {
    keywords: ['movie', 'theatre', 'bookmyshow', 'concert', 'game', 'amusement', 'park', 'outing', 'party'],
    category: 'Entertainment',
  },
  {
    keywords: ['netflix', 'spotify', 'prime video', 'hotstar', 'disney', 'youtube premium', 'apple music', 'subscription', 'membership', 'premium'],
    category: 'Subscriptions',
  },
  {
    keywords: ['mutual fund', 'sip', 'investment', 'stock', 'zerodha', 'groww', 'fd ', 'fixed deposit', 'ppf', 'nps', 'lic ', 'insurance premium', 'savings'],
    category: 'Investments & Savings',
  },
];

/**
 * Auto-categorize a transaction based on its description
 */
export function categorizeTransaction(description: string): ExpenseCategory {
  const normalizedDesc = description.toLowerCase().trim();

  for (const rule of CATEGORY_RULES) {
    for (const keyword of rule.keywords) {
      if (normalizedDesc.includes(keyword.toLowerCase())) {
        return rule.category;
      }
    }
  }

  return 'Other';
}

/**
 * Suggest a category with confidence
 */
export function suggestCategory(description: string): { category: ExpenseCategory; confidence: 'high' | 'medium' | 'low' } {
  const normalizedDesc = description.toLowerCase().trim();
  let bestMatch: { category: ExpenseCategory; matchCount: number } | null = null;

  for (const rule of CATEGORY_RULES) {
    let matchCount = 0;
    for (const keyword of rule.keywords) {
      if (normalizedDesc.includes(keyword.toLowerCase())) {
        matchCount++;
      }
    }
    if (matchCount > 0 && (!bestMatch || matchCount > bestMatch.matchCount)) {
      bestMatch = { category: rule.category, matchCount };
    }
  }

  if (!bestMatch) {
    return { category: 'Other', confidence: 'low' };
  }

  return {
    category: bestMatch.category,
    confidence: bestMatch.matchCount >= 2 ? 'high' : 'medium',
  };
}
