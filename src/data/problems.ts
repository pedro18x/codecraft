import type { Problem } from '@/types'
import { additionalProblems } from './moreProblems'

const coreProblems: Problem[] = [
  {
    id: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    categories: ['Array', 'Hash Table'],
    description:
      'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]',
      },
    ],
    constraints: [
      '2 <= nums.length <= 10⁴',
      '-10⁹ <= nums[i] <= 10⁹',
      '-10⁹ <= target <= 10⁹',
      'Only one valid answer exists.',
    ],
    testCases: [
      {
        input: '[2,7,11,15], 9',
        expectedOutput: '[0,1]',
      },
      {
        input: '[3,2,4], 6',
        expectedOutput: '[1,2]',
      },
      {
        input: '[3,3], 6',
        expectedOutput: '[0,1]',
      },
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
  // Your code here
}`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
  // Your code here
}`,
      python: `def two_sum(nums: list[int], target: int) -> list[int]:
    # Your code here
    pass`,
    },
    hints: [
      'Try using a hash table to store values you\'ve seen.',
      'For each number, check if target - number exists in your hash table.',
    ],
  },
  {
    id: 2,
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    categories: ['String', 'Hash Table'],
    description:
      'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.',
    examples: [
      {
        input: 's = "()"',
        output: 'true',
      },
      {
        input: 's = "()[]{}"',
        output: 'true',
      },
      {
        input: 's = "(]"',
        output: 'false',
      },
    ],
    constraints: ['1 <= s.length <= 10⁴', 's consists of parentheses only \'()[]{}\''],
    testCases: [
      {
        input: '"()"',
        expectedOutput: 'true',
      },
      {
        input: '"()[]{}"',
        expectedOutput: 'true',
      },
      {
        input: '"(]"',
        expectedOutput: 'false',
      },
    ],
    starterCode: {
      javascript: `function isValid(s) {
  // Your code here
}`,
      typescript: `function isValid(s: string): boolean {
  // Your code here
}`,
      python: `def is_valid(s: str) -> bool:
    # Your code here
    pass`,
    },
    hints: [
      'Use a stack data structure.',
      'When you encounter an opening bracket, push it to the stack.',
      'When you encounter a closing bracket, check if it matches the top of the stack.',
    ],
  },
  {
    id: 3,
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    categories: ['Tree'],
    description:
      'You are given the heads of two sorted linked lists `list1` and `list2`.\n\nMerge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.',
    examples: [
      {
        input: 'list1 = [1,2,4], list2 = [1,3,4]',
        output: '[1,1,2,3,4,4]',
      },
      {
        input: 'list1 = [], list2 = []',
        output: '[]',
      },
      {
        input: 'list1 = [], list2 = [0]',
        output: '[0]',
      },
    ],
    constraints: [
      'The number of nodes in both lists is in the range [0, 50].',
      '-100 <= Node.val <= 100',
      'Both list1 and list2 are sorted in non-decreasing order.',
    ],
    testCases: [
      {
        input: '[1,2,4], [1,3,4]',
        expectedOutput: '[1,1,2,3,4,4]',
      },
      {
        input: '[], []',
        expectedOutput: '[]',
      },
    ],
    starterCode: {
      javascript: `function mergeTwoLists(list1, list2) {
  // Your code here
}`,
      typescript: `function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
  // Your code here
}`,
      python: `def merge_two_lists(list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
    # Your code here
    pass`,
    },
  },
  {
    id: 4,
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    categories: ['Array', 'Dynamic Programming'],
    description:
      'Given an integer array `nums`, find the subarray with the largest sum, and return its sum.',
    examples: [
      {
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        output: '6',
        explanation: 'The subarray [4,-1,2,1] has the largest sum 6.',
      },
      {
        input: 'nums = [1]',
        output: '1',
      },
      {
        input: 'nums = [5,4,-1,7,8]',
        output: '23',
      },
    ],
    constraints: ['1 <= nums.length <= 10⁵', '-10⁴ <= nums[i] <= 10⁴'],
    testCases: [
      {
        input: '[-2,1,-3,4,-1,2,1,-5,4]',
        expectedOutput: '6',
      },
      {
        input: '[1]',
        expectedOutput: '1',
      },
      {
        input: '[5,4,-1,7,8]',
        expectedOutput: '23',
      },
    ],
    starterCode: {
      javascript: `function maxSubArray(nums) {
  // Your code here
}`,
      typescript: `function maxSubArray(nums: number[]): number {
  // Your code here
}`,
      python: `def max_sub_array(nums: list[int]) -> int:
    # Your code here
    pass`,
    },
    hints: [
      'Try using Kadane\'s algorithm.',
      'Keep track of the current sum and the maximum sum seen so far.',
    ],
  },
  {
    id: 5,
    title: 'Container With Most Water',
    difficulty: 'Medium',
    categories: ['Array', 'Greedy'],
    description:
      'You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i`th line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.',
    examples: [
      {
        input: 'height = [1,8,6,2,5,4,8,3,7]',
        output: '49',
        explanation:
          'The vertical lines are at indices 1 and 8. The area is min(8, 7) * (8 - 1) = 7 * 7 = 49.',
      },
      {
        input: 'height = [1,1]',
        output: '1',
      },
    ],
    constraints: [
      'n == height.length',
      '2 <= n <= 10⁵',
      '0 <= height[i] <= 10⁴',
    ],
    testCases: [
      {
        input: '[1,8,6,2,5,4,8,3,7]',
        expectedOutput: '49',
      },
      {
        input: '[1,1]',
        expectedOutput: '1',
      },
    ],
    starterCode: {
      javascript: `function maxArea(height) {
  // Your code here
}`,
      typescript: `function maxArea(height: number[]): number {
  // Your code here
}`,
      python: `def max_area(height: list[int]) -> int:
    # Your code here
    pass`,
    },
    hints: [
      'Use two pointers starting from both ends.',
      'Move the pointer with the smaller height inward.',
    ],
  },
  {
    id: 6,
    title: 'Longest Palindromic Substring',
    difficulty: 'Hard',
    categories: ['String', 'Dynamic Programming'],
    description:
      'Given a string `s`, return the longest palindromic substring in `s`.',
    examples: [
      {
        input: 's = "babad"',
        output: '"bab"',
        explanation: '"aba" is also a valid answer.',
      },
      {
        input: 's = "cbbd"',
        output: '"bb"',
      },
    ],
    constraints: ['1 <= s.length <= 1000', 's consist of only digits and English letters.'],
    testCases: [
      {
        input: '"babad"',
        expectedOutput: '"bab"',
      },
      {
        input: '"cbbd"',
        expectedOutput: '"bb"',
      },
    ],
    starterCode: {
      javascript: `function longestPalindrome(s) {
  // Your code here
}`,
      typescript: `function longestPalindrome(s: string): string {
  // Your code here
}`,
      python: `def longest_palindrome(s: str) -> str:
    # Your code here
    pass`,
    },
    hints: [
      'Expand around center for each possible center.',
      'Consider both odd and even length palindromes.',
    ],
  },
]

export const problems: Problem[] = [...coreProblems, ...additionalProblems]
