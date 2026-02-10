import type { Problem } from '@/types'

export const additionalProblems: Problem[] = [
  {
    id: 7,
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    categories: ['Tree'],
    description:
      'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    examples: [
      {
        input: 'head = [1,2,3,4,5]',
        output: '[5,4,3,2,1]',
      },
      {
        input: 'head = [1,2]',
        output: '[2,1]',
      },
      {
        input: 'head = []',
        output: '[]',
      },
    ],
    constraints: [
      'The number of nodes in the list is the range [0, 5000].',
      '-5000 <= Node.val <= 5000',
    ],
    testCases: [
      {
        input: '[1,2,3,4,5]',
        expectedOutput: '[5,4,3,2,1]',
      },
      {
        input: '[1,2]',
        expectedOutput: '[2,1]',
      },
      {
        input: '[]',
        expectedOutput: '[]',
      },
    ],
    starterCode: {
      javascript: `function reverseList(head) {
  // Your code here
}`,
      typescript: `function reverseList(head: ListNode | null): ListNode | null {
  // Your code here
}`,
      python: `def reverse_list(head: Optional[ListNode]) -> Optional[ListNode]:
    # Your code here
    pass`,
    },
    hints: [
      'Consider using three pointers: previous, current, and next.',
      'Iterate through the list and reverse the direction of each pointer.',
    ],
  },
  {
    id: 8,
    title: 'Binary Search',
    difficulty: 'Easy',
    categories: ['Array', 'Binary Search'],
    description:
      'Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.\n\nYou must write an algorithm with O(log n) runtime complexity.',
    examples: [
      {
        input: 'nums = [-1,0,3,5,9,12], target = 9',
        output: '4',
        explanation: '9 exists in nums and its index is 4',
      },
      {
        input: 'nums = [-1,0,3,5,9,12], target = 2',
        output: '-1',
        explanation: '2 does not exist in nums so return -1',
      },
    ],
    constraints: [
      '1 <= nums.length <= 10⁴',
      '-10⁴ < nums[i], target < 10⁴',
      'All integers in nums are unique.',
      'nums is sorted in ascending order.',
    ],
    testCases: [
      {
        input: '[-1,0,3,5,9,12], 9',
        expectedOutput: '4',
      },
      {
        input: '[-1,0,3,5,9,12], 2',
        expectedOutput: '-1',
      },
    ],
    starterCode: {
      javascript: `function search(nums, target) {
  // Your code here
}`,
      typescript: `function search(nums: number[], target: number): number {
  // Your code here
}`,
      python: `def search(nums: list[int], target: int) -> int:
    # Your code here
    pass`,
    },
    hints: [
      'Use two pointers: left and right to track the search space.',
      'Compare the target with the middle element and adjust pointers accordingly.',
    ],
  },
  {
    id: 9,
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    categories: ['Math', 'Dynamic Programming'],
    description:
      'You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    examples: [
      {
        input: 'n = 2',
        output: '2',
        explanation: 'There are two ways to climb to the top: 1+1 or 2',
      },
      {
        input: 'n = 3',
        output: '3',
        explanation: 'There are three ways: 1+1+1, 1+2, or 2+1',
      },
    ],
    constraints: ['1 <= n <= 45'],
    testCases: [
      {
        input: '2',
        expectedOutput: '2',
      },
      {
        input: '3',
        expectedOutput: '3',
      },
      {
        input: '5',
        expectedOutput: '8',
      },
    ],
    starterCode: {
      javascript: `function climbStairs(n) {
  // Your code here
}`,
      typescript: `function climbStairs(n: number): number {
  // Your code here
}`,
      python: `def climb_stairs(n: int) -> int:
    # Your code here
    pass`,
    },
    hints: [
      'This is a Fibonacci sequence problem.',
      'The number of ways to reach step n is the sum of ways to reach step n-1 and n-2.',
    ],
  },
  {
    id: 10,
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    categories: ['Array', 'Dynamic Programming'],
    description:
      'You are given an array `prices` where `prices[i]` is the price of a given stock on the ith day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.',
    examples: [
      {
        input: 'prices = [7,1,5,3,6,4]',
        output: '5',
        explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.',
      },
      {
        input: 'prices = [7,6,4,3,1]',
        output: '0',
        explanation: 'In this case, no transactions are done and the max profit = 0.',
      },
    ],
    constraints: ['1 <= prices.length <= 10⁵', '0 <= prices[i] <= 10⁴'],
    testCases: [
      {
        input: '[7,1,5,3,6,4]',
        expectedOutput: '5',
      },
      {
        input: '[7,6,4,3,1]',
        expectedOutput: '0',
      },
    ],
    starterCode: {
      javascript: `function maxProfit(prices) {
  // Your code here
}`,
      typescript: `function maxProfit(prices: number[]): number {
  // Your code here
}`,
      python: `def max_profit(prices: list[int]) -> int:
    # Your code here
    pass`,
    },
    hints: [
      'Keep track of the minimum price seen so far.',
      'For each price, calculate the profit if you sold today.',
    ],
  },
  {
    id: 11,
    title: 'Valid Anagram',
    difficulty: 'Easy',
    categories: ['String', 'Hash Table', 'Sorting'],
    description:
      'Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.',
    examples: [
      {
        input: 's = "anagram", t = "nagaram"',
        output: 'true',
      },
      {
        input: 's = "rat", t = "car"',
        output: 'false',
      },
    ],
    constraints: [
      '1 <= s.length, t.length <= 5 * 10⁴',
      's and t consist of lowercase English letters.',
    ],
    testCases: [
      {
        input: '"anagram", "nagaram"',
        expectedOutput: 'true',
      },
      {
        input: '"rat", "car"',
        expectedOutput: 'false',
      },
    ],
    starterCode: {
      javascript: `function isAnagram(s, t) {
  // Your code here
}`,
      typescript: `function isAnagram(s: string, t: string): boolean {
  // Your code here
}`,
      python: `def is_anagram(s: str, t: str) -> bool:
    # Your code here
    pass`,
    },
    hints: [
      'Sort both strings and compare them.',
      'Or use a hash map to count character frequencies.',
    ],
  },
  {
    id: 12,
    title: '3Sum',
    difficulty: 'Medium',
    categories: ['Array', 'Sorting'],
    description:
      'Given an integer array nums, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\nNotice that the solution set must not contain duplicate triplets.',
    examples: [
      {
        input: 'nums = [-1,0,1,2,-1,-4]',
        output: '[[-1,-1,2],[-1,0,1]]',
      },
      {
        input: 'nums = [0,1,1]',
        output: '[]',
      },
      {
        input: 'nums = [0,0,0]',
        output: '[[0,0,0]]',
      },
    ],
    constraints: ['3 <= nums.length <= 3000', '-10⁵ <= nums[i] <= 10⁵'],
    testCases: [
      {
        input: '[-1,0,1,2,-1,-4]',
        expectedOutput: '[[-1,-1,2],[-1,0,1]]',
      },
      {
        input: '[0,1,1]',
        expectedOutput: '[]',
      },
      {
        input: '[0,0,0]',
        expectedOutput: '[[0,0,0]]',
      },
    ],
    starterCode: {
      javascript: `function threeSum(nums) {
  // Your code here
}`,
      typescript: `function threeSum(nums: number[]): number[][] {
  // Your code here
}`,
      python: `def three_sum(nums: list[int]) -> list[list[int]]:
    # Your code here
    pass`,
    },
    hints: [
      'Sort the array first.',
      'Use two pointers after fixing one element.',
      'Skip duplicates to avoid duplicate triplets.',
    ],
  },
  {
    id: 13,
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    categories: ['String', 'Hash Table'],
    description:
      'Given a string `s`, find the length of the longest substring without repeating characters.',
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.',
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.',
      },
      {
        input: 's = "pwwkew"',
        output: '3',
        explanation: 'The answer is "wke", with the length of 3.',
      },
    ],
    constraints: [
      '0 <= s.length <= 5 * 10⁴',
      's consists of English letters, digits, symbols and spaces.',
    ],
    testCases: [
      {
        input: '"abcabcbb"',
        expectedOutput: '3',
      },
      {
        input: '"bbbbb"',
        expectedOutput: '1',
      },
      {
        input: '"pwwkew"',
        expectedOutput: '3',
      },
    ],
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {
  // Your code here
}`,
      typescript: `function lengthOfLongestSubstring(s: string): number {
  // Your code here
}`,
      python: `def length_of_longest_substring(s: str) -> int:
    # Your code here
    pass`,
    },
    hints: [
      'Use sliding window technique with two pointers.',
      'Use a hash map to store the last seen index of each character.',
    ],
  },
  {
    id: 14,
    title: 'Group Anagrams',
    difficulty: 'Medium',
    categories: ['String', 'Hash Table', 'Sorting'],
    description:
      'Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.',
    examples: [
      {
        input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
      },
      {
        input: 'strs = [""]',
        output: '[[""]]',
      },
      {
        input: 'strs = ["a"]',
        output: '[["a"]]',
      },
    ],
    constraints: [
      '1 <= strs.length <= 10⁴',
      '0 <= strs[i].length <= 100',
      'strs[i] consists of lowercase English letters.',
    ],
    testCases: [
      {
        input: '["eat","tea","tan","ate","nat","bat"]',
        expectedOutput: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
      },
      {
        input: '[""]',
        expectedOutput: '[[""]]',
      },
      {
        input: '["a"]',
        expectedOutput: '[["a"]]',
      },
    ],
    starterCode: {
      javascript: `function groupAnagrams(strs) {
  // Your code here
}`,
      typescript: `function groupAnagrams(strs: string[]): string[][] {
  // Your code here
}`,
      python: `def group_anagrams(strs: list[str]) -> list[list[str]]:
    # Your code here
    pass`,
    },
    hints: [
      'Sort each string and use it as a key in a hash map.',
      'All anagrams will have the same sorted string.',
    ],
  },
  {
    id: 15,
    title: 'Product of Array Except Self',
    difficulty: 'Medium',
    categories: ['Array'],
    description:
      'Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.\n\nThe product of any prefix or suffix of `nums` is guaranteed to fit in a 32-bit integer.\n\nYou must write an algorithm that runs in O(n) time and without using the division operation.',
    examples: [
      {
        input: 'nums = [1,2,3,4]',
        output: '[24,12,8,6]',
      },
      {
        input: 'nums = [-1,1,0,-3,3]',
        output: '[0,0,9,0,0]',
      },
    ],
    constraints: [
      '2 <= nums.length <= 10⁵',
      '-30 <= nums[i] <= 30',
      'The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.',
    ],
    testCases: [
      {
        input: '[1,2,3,4]',
        expectedOutput: '[24,12,8,6]',
      },
      {
        input: '[-1,1,0,-3,3]',
        expectedOutput: '[0,0,9,0,0]',
      },
    ],
    starterCode: {
      javascript: `function productExceptSelf(nums) {
  // Your code here
}`,
      typescript: `function productExceptSelf(nums: number[]): number[] {
  // Your code here
}`,
      python: `def product_except_self(nums: list[int]) -> list[int]:
    # Your code here
    pass`,
    },
    hints: [
      'Calculate left products and right products separately.',
      'The answer at index i is leftProduct[i] * rightProduct[i].',
    ],
  },
  {
    id: 16,
    title: 'Word Search',
    difficulty: 'Medium',
    categories: ['Array', 'Backtracking'],
    description:
      'Given an m x n grid of characters `board` and a string `word`, return `true` if `word` exists in the grid.\n\nThe word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.',
    examples: [
      {
        input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"',
        output: 'true',
      },
      {
        input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"',
        output: 'true',
      },
      {
        input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"',
        output: 'false',
      },
    ],
    constraints: [
      'm == board.length',
      'n = board[i].length',
      '1 <= m, n <= 6',
      '1 <= word.length <= 15',
      'board and word consists of only lowercase and uppercase English letters.',
    ],
    testCases: [
      {
        input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCCED"',
        expectedOutput: 'true',
      },
      {
        input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "SEE"',
        expectedOutput: 'true',
      },
      {
        input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCB"',
        expectedOutput: 'false',
      },
    ],
    starterCode: {
      javascript: `function exist(board, word) {
  // Your code here
}`,
      typescript: `function exist(board: string[][], word: string): boolean {
  // Your code here
}`,
      python: `def exist(board: list[list[str]], word: str) -> bool:
    # Your code here
    pass`,
    },
    hints: [
      'Use depth-first search (DFS) with backtracking.',
      'Mark visited cells temporarily and unmark them when backtracking.',
    ],
  },
  {
    id: 17,
    title: 'Merge Intervals',
    difficulty: 'Medium',
    categories: ['Array', 'Sorting'],
    description:
      'Given an array of intervals where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
    examples: [
      {
        input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
        output: '[[1,6],[8,10],[15,18]]',
        explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].',
      },
      {
        input: 'intervals = [[1,4],[4,5]]',
        output: '[[1,5]]',
        explanation: 'Intervals [1,4] and [4,5] are considered overlapping.',
      },
    ],
    constraints: [
      '1 <= intervals.length <= 10⁴',
      'intervals[i].length == 2',
      '0 <= start_i <= end_i <= 10⁴',
    ],
    testCases: [
      {
        input: '[[1,3],[2,6],[8,10],[15,18]]',
        expectedOutput: '[[1,6],[8,10],[15,18]]',
      },
      {
        input: '[[1,4],[4,5]]',
        expectedOutput: '[[1,5]]',
      },
    ],
    starterCode: {
      javascript: `function merge(intervals) {
  // Your code here
}`,
      typescript: `function merge(intervals: number[][]): number[][] {
  // Your code here
}`,
      python: `def merge(intervals: list[list[int]]) -> list[list[int]]:
    # Your code here
    pass`,
    },
    hints: [
      'Sort intervals by start time first.',
      'Iterate through sorted intervals and merge when they overlap.',
    ],
  },
  {
    id: 18,
    title: 'Regular Expression Matching',
    difficulty: 'Hard',
    categories: ['String', 'Dynamic Programming', 'Backtracking'],
    description:
      'Given an input string `s` and a pattern `p`, implement regular expression matching with support for `.` and `*` where:\n\n- `.` Matches any single character.\n- `*` Matches zero or more of the preceding element.\n\nThe matching should cover the entire input string (not partial).',
    examples: [
      {
        input: 's = "aa", p = "a"',
        output: 'false',
        explanation: '"a" does not match the entire string "aa".',
      },
      {
        input: 's = "aa", p = "a*"',
        output: 'true',
        explanation: '"*" means zero or more of the preceding element, "a". Therefore, by repeating "a" once, it becomes "aa".',
      },
      {
        input: 's = "ab", p = ".*"',
        output: 'true',
        explanation: '".*" means "zero or more (*) of any character (.)".',
      },
    ],
    constraints: [
      '1 <= s.length <= 20',
      '1 <= p.length <= 30',
      's contains only lowercase English letters.',
      'p contains only lowercase English letters, ".", and "*".',
      'It is guaranteed for each appearance of the character "*", there will be a previous valid character to match.',
    ],
    testCases: [
      {
        input: '"aa", "a"',
        expectedOutput: 'false',
      },
      {
        input: '"aa", "a*"',
        expectedOutput: 'true',
      },
      {
        input: '"ab", ".*"',
        expectedOutput: 'true',
      },
    ],
    starterCode: {
      javascript: `function isMatch(s, p) {
  // Your code here
}`,
      typescript: `function isMatch(s: string, p: string): boolean {
  // Your code here
}`,
      python: `def is_match(s: str, p: str) -> bool:
    # Your code here
    pass`,
    },
    hints: [
      'Use dynamic programming with a 2D table.',
      'Handle the "*" case by considering matching zero or more characters.',
    ],
  },
  {
    id: 19,
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    categories: ['Array', 'Binary Search'],
    description:
      'Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be O(log (m+n)).',
    examples: [
      {
        input: 'nums1 = [1,3], nums2 = [2]',
        output: '2.00000',
        explanation: 'merged array = [1,2,3] and median is 2.',
      },
      {
        input: 'nums1 = [1,2], nums2 = [3,4]',
        output: '2.50000',
        explanation: 'merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.',
      },
    ],
    constraints: [
      'nums1.length == m',
      'nums2.length == n',
      '0 <= m <= 1000',
      '0 <= n <= 1000',
      '1 <= m + n <= 2000',
      '-10⁶ <= nums1[i], nums2[i] <= 10⁶',
    ],
    testCases: [
      {
        input: '[1,3], [2]',
        expectedOutput: '2.0',
      },
      {
        input: '[1,2], [3,4]',
        expectedOutput: '2.5',
      },
    ],
    starterCode: {
      javascript: `function findMedianSortedArrays(nums1, nums2) {
  // Your code here
}`,
      typescript: `function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
  // Your code here
}`,
      python: `def find_median_sorted_arrays(nums1: list[int], nums2: list[int]) -> float:
    # Your code here
    pass`,
    },
    hints: [
      'Use binary search on the smaller array.',
      'Find the partition point where elements on the left are smaller than elements on the right.',
    ],
  },
  {
    id: 20,
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    categories: ['Array', 'Dynamic Programming'],
    description:
      'Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    examples: [
      {
        input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        output: '6',
        explanation: 'The elevation map (black section) is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are being trapped.',
      },
      {
        input: 'height = [4,2,0,3,2,5]',
        output: '9',
      },
    ],
    constraints: ['n == height.length', '1 <= n <= 2 * 10⁴', '0 <= height[i] <= 10⁵'],
    testCases: [
      {
        input: '[0,1,0,2,1,0,1,3,2,1,2,1]',
        expectedOutput: '6',
      },
      {
        input: '[4,2,0,3,2,5]',
        expectedOutput: '9',
      },
    ],
    starterCode: {
      javascript: `function trap(height) {
  // Your code here
}`,
      typescript: `function trap(height: number[]): number {
  // Your code here
}`,
      python: `def trap(height: list[int]) -> int:
    # Your code here
    pass`,
    },
    hints: [
      'For each position, the water level is determined by the minimum of max heights to its left and right.',
      'Use dynamic programming to precompute left and right max heights, or use two pointers.',
    ],
  },
]
