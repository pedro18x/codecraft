import { PrismaClient } from '@prisma/client'

const problems = [
  {
    id: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    categories: ['Arrays', 'Hash Table'],
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' }
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9'],
    testCases: [
      { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]' },
      { input: '[3,2,4]\n6', expectedOutput: '[1,2]' },
      { input: '[3,3]\n6', expectedOutput: '[0,1]' }
    ],
    starterCode: { javascript: 'function twoSum(nums, target) {\n  \n}', typescript: 'function twoSum(nums: number[], target: number): number[] {\n  \n}' },
    hints: ['Try using a hash map to store the elements you have already seen.']
  },
  {
    id: 2,
    title: 'Reverse String',
    difficulty: 'Easy',
    categories: ['String', 'Two Pointers'],
    description: 'Write a function that reverses a string. The input string is given as an array of characters s.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.',
    examples: [
      { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]', explanation: null }
    ],
    constraints: ['1 <= s.length <= 10^5', 's[i] is a printable ascii character.'],
    testCases: [
      { input: '["h","e","l","l","o"]', expectedOutput: '["o","l","l","e","h"]' },
      { input: '["H","a","n","n","a","h"]', expectedOutput: '["h","a","n","n","a","H"]' }
    ],
    starterCode: { javascript: 'function reverseString(s) {\n  \n}', typescript: 'function reverseString(s: string[]): void {\n  \n}' },
    hints: ['Consider using two pointers swap technique.']
  },
  {
    id: 3,
    title: 'Valid Palindrome',
    difficulty: 'Easy',
    categories: ['String', 'Two Pointers'],
    description: 'Given a string s, return true if it is a palindrome, or false otherwise.',
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: '"amanaplanacanalpanama" is a palindrome.' }
    ],
    constraints: ['1 <= s.length <= 2 * 10^5'],
    testCases: [
      { input: '"A man, a plan, a canal: Panama"', expectedOutput: 'true' },
      { input: '"race a car"', expectedOutput: 'false' }
    ],
    starterCode: { javascript: 'function isPalindrome(s) {\n  \n}', typescript: 'function isPalindrome(s: string): boolean {\n  \n}' },
    hints: ['Remove non-alphanumeric characters and convert to lowercase.']
  },
  {
    id: 4,
    title: 'Contains Duplicate',
    difficulty: 'Easy',
    categories: ['Array', 'Hash Table'],
    description: 'Given an integer array nums, return true if any value appears at least twice in the array.',
    examples: [{ input: 'nums = [1,2,3,1]', output: 'true' }],
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { input: '[1,2,3,1]', expectedOutput: 'true' },
      { input: '[1,2,3,4]', expectedOutput: 'false' }
    ],
    starterCode: { javascript: 'function containsDuplicate(nums) {\n  \n}', typescript: 'function containsDuplicate(nums: number[]): boolean {\n  \n}' },
    hints: ['Use a Set for efficient lookup.']
  },
  {
    id: 5,
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    categories: ['Hash Table', 'String', 'Sliding Window'],
    description: 'Find the length of the longest substring without repeating characters.',
    examples: [{ input: 's = "abcabcbb"', output: '3' }],
    constraints: ['0 <= s.length <= 5 * 10^4'],
    testCases: [
      { input: '"abcabcbb"', expectedOutput: '3' },
      { input: '"bbbbb"', expectedOutput: '1' }
    ],
    starterCode: { javascript: 'function lengthOfLongestSubstring(s) {\n  \n}', typescript: 'function lengthOfLongestSubstring(s: string): number {\n  \n}' },
    hints: ['Sliding window approach works best.']
  },
  {
    id: 6,
    title: 'Fizz Buzz',
    difficulty: 'Easy',
    categories: ['Array', 'Math'],
    description: 'Return a string array answer (1-indexed) where: answer[i] is "FizzBuzz" if divisible by 3 and 5, "Fizz" if divisible by 3, "Buzz" if divisible by 5, or the index as a string.',
    examples: [{ input: 'n = 3', output: '["1","2","Fizz"]' }],
    constraints: ['1 <= n <= 10^4'],
    testCases: [
      { input: '3', expectedOutput: '["1","2","Fizz"]' },
      { input: '5', expectedOutput: '["1","2","Fizz","4","Buzz"]' },
      { input: '15', expectedOutput: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]' }
    ],
    starterCode: { javascript: 'function fizzBuzz(n) {\n  \n}', typescript: 'function fizzBuzz(n: number): string[] {\n  \n}' },
    hints: ['Iterate from 1 to n and use modulo operator.']
  },
  {
    id: 7,
    title: 'Fibonacci Number',
    difficulty: 'Easy',
    categories: ['Math', 'Dynamic Programming'],
    description: 'The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. Given n, calculate F(n).',
    examples: [{ input: 'n = 2', output: '1' }],
    constraints: ['0 <= n <= 30'],
    testCases: [
      { input: '2', expectedOutput: '1' },
      { input: '3', expectedOutput: '2' },
      { input: '4', expectedOutput: '3' }
    ],
    starterCode: { javascript: 'function fib(n) {\n  \n}', typescript: 'function fib(n: number): number {\n  \n}' },
    hints: ['You can use recursion with memoization or iterative approach.']
  },
  {
    id: 8,
    title: 'Valid Anagram',
    difficulty: 'Easy',
    categories: ['String', 'Sorting'],
    description: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise.',
    examples: [{ input: 's = "anagram", t = "nagaram"', output: 'true' }],
    constraints: ['1 <= s.length, t.length <= 5 * 10^4'],
    testCases: [
      { input: '"anagram"\n"nagaram"', expectedOutput: 'true' },
      { input: '"rat"\n"car"', expectedOutput: 'false' }
    ],
    starterCode: { javascript: 'function isAnagram(s, t) {\n  \n}', typescript: 'function isAnagram(s: string, t: string): boolean {\n  \n}' },
    hints: ['Count the frequency of each character or sort the strings.']
  },
  {
    id: 9,
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    categories: ['Array', 'Divide and Conquer', 'Dynamic Programming'],
    description: 'Find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.',
    examples: [{ input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: '[4,-1,2,1] has the largest sum = 6.' }],
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6' },
      { input: '[1]', expectedOutput: '1' },
      { input: '[5,4,-1,7,8]', expectedOutput: '23' }
    ],
    starterCode: { javascript: 'function maxSubArray(nums) {\n  \n}', typescript: 'function maxSubArray(nums: number[]): number {\n  \n}' },
    hints: ["Use Kadane's Algorithm for an O(n) solution."]
  },
  {
    id: 10,
    title: 'Merge Sorted Array',
    difficulty: 'Easy',
    categories: ['Array', 'Two Pointers'],
    description: 'Merge two sorted integer arrays nums1 and nums2 into nums1 as one sorted array. nums1 has a size of m + n.',
    examples: [{ input: 'nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3', output: '[1,2,2,3,5,6]' }],
    constraints: ['nums1.length == m + n', 'nums2.length == n'],
    testCases: [
      { input: '[1,2,3,0,0,0]\n3\n[2,5,6]\n3', expectedOutput: '[1,2,2,3,5,6]' },
      { input: '[1]\n1\n[]\n0', expectedOutput: '[1]' }
    ],
    starterCode: { javascript: 'function merge(nums1, m, nums2, n) {\n  \n}', typescript: 'function merge(nums1: number[], m: number, nums2: number[], n: number): void {\n  \n}' },
    hints: ['Work backwards from the end of nums1 to avoid overriding elements.']
  },
  {
    id: 11,
    title: 'Palindrome Number',
    difficulty: 'Easy',
    categories: ['Math'],
    description: 'Given an integer x, return true if x is a palindrome integer.',
    examples: [{ input: 'x = 121', output: 'true' }],
    constraints: ['-2^31 <= x <= 2^31 - 1'],
    testCases: [
      { input: '121', expectedOutput: 'true' },
      { input: '-121', expectedOutput: 'false' },
      { input: '10', expectedOutput: 'false' }
    ],
    starterCode: { javascript: 'function isPalindrome(x) {\n  \n}', typescript: 'function isPalindrome(x: number): boolean {\n  \n}' },
    hints: ['Negative numbers cannot be palindromes. Try reversing the half of the number.']
  },
  {
    id: 12,
    title: 'Move Zeroes',
    difficulty: 'Easy',
    categories: ['Array', 'Two Pointers'],
    description: 'Given an integer array nums, move all 0\'s to the end of it while maintaining the relative order of the non-zero elements.',
    examples: [{ input: 'nums = [0,1,0,3,12]', output: '[1,3,12,0,0]' }],
    constraints: ['1 <= nums.length <= 10^4'],
    testCases: [
      { input: '[0,1,0,3,12]', expectedOutput: '[1,3,12,0,0]' },
      { input: '[0]', expectedOutput: '[0]' }
    ],
    starterCode: { javascript: 'function moveZeroes(nums) {\n  \n}', typescript: 'function moveZeroes(nums: number[]): void {\n  \n}' },
    hints: ['Use one pointer to track the position of the last non-zero element.']
  },
  {
    id: 13,
    title: 'First Unique Character in a String',
    difficulty: 'Easy',
    categories: ['Hash Table', 'String'],
    description: 'Given a string s, find the first non-repeating character in it and return its index. If it does not exist, return -1.',
    examples: [{ input: 's = "leetcode"', output: '0' }],
    constraints: ['1 <= s.length <= 10^5'],
    testCases: [
      { input: '"leetcode"', expectedOutput: '0' },
      { input: '"loveleetcode"', expectedOutput: '2' },
      { input: '"aabb"', expectedOutput: '-1' }
    ],
    starterCode: { javascript: 'function firstUniqChar(s) {\n  \n}', typescript: 'function firstUniqChar(s: string): number {\n  \n}' },
    hints: ['Use a frequency map to count occurrences of each character.']
  },
  {
    id: 14,
    title: 'Ransom Note',
    difficulty: 'Easy',
    categories: ['Hash Table', 'String'],
    description: 'Given two strings ransomNote and magazine, return true if ransomNote can be constructed by using the characters from magazine and false otherwise.',
    examples: [{ input: 'ransomNote = "a", magazine = "b"', output: 'false' }],
    constraints: ['1 <= ransomNote.length, magazine.length <= 10^5'],
    testCases: [
      { input: '"a"\n"b"', expectedOutput: 'false' },
      { input: '"aa"\n"ab"', expectedOutput: 'false' },
      { input: '"aa"\n"aab"', expectedOutput: 'true' }
    ],
    starterCode: { javascript: 'function canConstruct(ransomNote, magazine) {\n  \n}', typescript: 'function canConstruct(ransomNote: string, magazine: string): boolean {\n  \n}' },
    hints: ['Count each character available in the magazine.']
  },
  {
    id: 15,
    title: 'Majority Element',
    difficulty: 'Easy',
    categories: ['Array', 'Hash Table', 'Sorting', 'Divide and Conquer'],
    description: 'Given an array nums of size n, return the majority element. The majority element is the element that appears more than ⌊n / 2⌋ times. You may assume that the majority element always exists in the array.',
    examples: [{ input: 'nums = [3,2,3]', output: '3' }],
    constraints: ['n == nums.length', '1 <= n <= 5 * 10^4'],
    testCases: [
      { input: '[3,2,3]', expectedOutput: '3' },
      { input: '[2,2,1,1,1,2,2]', expectedOutput: '2' }
    ],
    starterCode: { javascript: 'function majorityElement(nums) {\n  \n}', typescript: 'function majorityElement(nums: number[]): number {\n  \n}' },
    hints: ["Boyer-Moore Voting Algorithm is an efficient O(1) space solution."]
  },
  {
    id: 16,
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    categories: ['String', 'Stack'],
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    examples: [{ input: 's = "()"', output: 'true' }],
    constraints: ['1 <= s.length <= 10^4'],
    testCases: [
      { input: '"()"', expectedOutput: 'true' },
      { input: '"()[]{}"', expectedOutput: 'true' },
      { input: '"(]"', expectedOutput: 'false' }
    ],
    starterCode: { javascript: 'function isValid(s) {\n  \n}', typescript: 'function isValid(s: string): boolean {\n  \n}' },
    hints: ['Use a stack to keep track of opening brackets.']
  },
  {
    id: 17,
    title: 'Length of Last Word',
    difficulty: 'Easy',
    categories: ['String'],
    description: 'Given a string s consisting of words and spaces, return the length of the last word in the string.',
    examples: [{ input: 's = "Hello World"', output: '5' }],
    constraints: ['1 <= s.length <= 10^4'],
    testCases: [
      { input: '"Hello World"', expectedOutput: '5' },
      { input: '"   fly me   to   the moon  "', expectedOutput: '4' }
    ],
    starterCode: { javascript: 'function lengthOfLastWord(s) {\n  \n}', typescript: 'function lengthOfLastWord(s: string): number {\n  \n}' },
    hints: ['Trim the string and split by spaces, or traverse from the end.']
  },
  {
    id: 18,
    title: 'Plus One',
    difficulty: 'Easy',
    categories: ['Array', 'Math'],
    description: 'You are given a large integer represented as an integer array digits. Increment the large integer by one and return the resulting array of digits.',
    examples: [{ input: 'digits = [1,2,3]', output: '[1,2,4]' }],
    constraints: ['1 <= digits.length <= 100'],
    testCases: [
      { input: '[1,2,3]', expectedOutput: '[1,2,4]' },
      { input: '[9]', expectedOutput: '[1,0]' }
    ],
    starterCode: { javascript: 'function plusOne(digits) {\n  \n}', typescript: 'function plusOne(digits: number[]): number[] {\n  \n}' },
    hints: ['Consider the carry when the digit is 9.']
  },
  {
    id: 19,
    title: 'Sqrt(x)',
    difficulty: 'Easy',
    categories: ['Math', 'Binary Search'],
    description: 'Given a non-negative integer x, compute and return the square root of x. Since the return type is an integer, the decimal digits are truncated.',
    examples: [{ input: 'x = 4', output: '2' }],
    constraints: ['0 <= x <= 2^31 - 1'],
    testCases: [
      { input: '4', expectedOutput: '2' },
      { input: '8', expectedOutput: '2' }
    ],
    starterCode: { javascript: 'function mySqrt(x) {\n  \n}', typescript: 'function mySqrt(x: number): number {\n  \n}' },
    hints: ['Binary search is faster than linear scan.']
  },
  {
    id: 20,
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    categories: ['Math', 'Dynamic Programming', 'Memoization'],
    description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    examples: [{ input: 'n = 2', output: '2' }],
    constraints: ['1 <= n <= 45'],
    testCases: [
      { input: '2', expectedOutput: '2' },
      { input: '3', expectedOutput: '3' }
    ],
    starterCode: { javascript: 'function climbStairs(n) {\n  \n}', typescript: 'function climbStairs(n: number): number {\n  \n}' },
    hints: ['This is actually a Fibonacci problem.']
  },
  {
    id: 21,
    title: 'Remove Duplicates from Sorted Array',
    difficulty: 'Easy',
    categories: ['Array', 'Two Pointers'],
    description: 'Given a sorted array nums, remove the duplicates in-place such that each element appears only once and returns the new length.',
    examples: [{ input: 'nums = [1,1,2]', output: '2' }],
    constraints: ['0 <= nums.length <= 3 * 10^4'],
    testCases: [
      { input: '[1,1,2]', expectedOutput: '2' },
      { input: '[0,0,1,1,1,2,2,3,3,4]', expectedOutput: '5' }
    ],
    starterCode: { javascript: 'function removeDuplicates(nums) {\n  \n}', typescript: 'function removeDuplicates(nums: number[]): number {\n  \n}' },
    hints: ['Use two pointers, one for iterating and one for the slow update.']
  },
  {
    id: 22,
    title: 'Single Number',
    difficulty: 'Easy',
    categories: ['Array', 'Bit Manipulation'],
    description: 'Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.',
    examples: [{ input: 'nums = [2,2,1]', output: '1' }],
    constraints: ['1 <= nums.length <= 3 * 10^4'],
    testCases: [
      { input: '[2,2,1]', expectedOutput: '1' },
      { input: '[4,1,2,1,2]', expectedOutput: '4' }
    ],
    starterCode: { javascript: 'function singleNumber(nums) {\n  \n}', typescript: 'function singleNumber(nums: number[]): number {\n  \n}' },
    hints: ['XORing all numbers will leave you with the single one.']
  },
  {
    id: 23,
    title: 'Power of Two',
    difficulty: 'Easy',
    categories: ['Math', 'Bit Manipulation'],
    description: 'Given an integer n, return true if it is a power of two. Otherwise, return false.',
    examples: [{ input: 'n = 1', output: 'true' }],
    constraints: ['-2^31 <= n <= 2^31 - 1'],
    testCases: [
      { input: '1', expectedOutput: 'true' },
      { input: '16', expectedOutput: 'true' },
      { input: '3', expectedOutput: 'false' }
    ],
    starterCode: { javascript: 'function isPowerOfTwo(n) {\n  \n}', typescript: 'function isPowerOfTwo(n: number): boolean {\n  \n}' },
    hints: ['A power of two in binary has exactly one set bit.']
  },
  {
    id: 24,
    title: 'Happy Number',
    difficulty: 'Easy',
    categories: ['Math', 'Hash Table', 'Two Pointers'],
    description: 'Write an algorithm to determine if a number n is happy. A happy number is defined by a process of replacing the number by the sum of the squares of its digits.',
    examples: [{ input: 'n = 19', output: 'true' }],
    constraints: ['1 <= n <= 2^31 - 1'],
    testCases: [
      { input: '19', expectedOutput: 'true' },
      { input: '2', expectedOutput: 'false' }
    ],
    starterCode: { javascript: 'function isHappy(n) {\n  \n}', typescript: 'function isHappy(n: number): boolean {\n  \n}' },
    hints: ["Use a Set to detect cycles, or Floyd's Cycle-Finding Algorithm."]
  },
  {
    id: 25,
    title: 'Valid Perfect Square',
    difficulty: 'Easy',
    categories: ['Math', 'Binary Search'],
    description: 'Given a positive integer num, write a function which returns True if num is a perfect square else False.',
    examples: [{ input: 'num = 16', output: 'true' }],
    constraints: ['1 <= num <= 2^31 - 1'],
    testCases: [
      { input: '16', expectedOutput: 'true' },
      { input: '14', expectedOutput: 'false' }
    ],
    starterCode: { javascript: 'function isPerfectSquare(num) {\n  \n}', typescript: 'function isPerfectSquare(num: number): boolean {\n  \n}' },
    hints: ['Binary search between 1 and num.']
  },
  {
    id: 26,
    title: 'Third Maximum Number',
    difficulty: 'Easy',
    categories: ['Array', 'Sorting'],
    description: 'Given an integer array nums, return the third distinct maximum number in this array. If the third maximum does not exist, return the maximum number.',
    examples: [{ input: 'nums = [3,2,1]', output: '1' }],
    constraints: ['1 <= nums.length <= 10^4'],
    testCases: [
      { input: '[3,2,1]', expectedOutput: '1' },
      { input: '[1,2]', expectedOutput: '2' },
      { input: '[2,2,3,1]', expectedOutput: '1' }
    ],
    starterCode: { javascript: 'function thirdMax(nums) {\n  \n}', typescript: 'function thirdMax(nums: number[]): number {\n  \n}' },
    hints: ['Track the top three maximums or use a sorted Set.']
  },
  {
    id: 27,
    title: 'Find All Numbers Disappeared in an Array',
    difficulty: 'Easy',
    categories: ['Array', 'Hash Table'],
    description: 'Given an array nums of n integers where nums[i] is in the range [1, n], return an array of all the integers in the range [1, n] that do not appear in nums.',
    examples: [{ input: 'nums = [4,3,2,7,8,2,3,1]', output: '[5,6]' }],
    constraints: ['n == nums.length', '1 <= n <= 10^5'],
    testCases: [
      { input: '[4,3,2,7,8,2,3,1]', expectedOutput: '[5,6]' },
      { input: '[1,1]', expectedOutput: '[2]' }
    ],
    starterCode: { javascript: 'function findDisappearedNumbers(nums) {\n  \n}', typescript: 'function findDisappearedNumbers(nums: number[]): number[] {\n  \n}' },
    hints: ['You can use the input array itself as a hash table by mapping values to indices.']
  },
  {
    id: 28,
    title: 'Binary Search',
    difficulty: 'Easy',
    categories: ['Array', 'Binary Search'],
    description: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.',
    examples: [{ input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4' }],
    constraints: ['1 <= nums.length <= 10^4'],
    testCases: [
      { input: '[-1,0,3,5,9,12]\n9', expectedOutput: '4' },
      { input: '[-1,0,3,5,9,12]\n2', expectedOutput: '-1' }
    ],
    starterCode: { javascript: 'function search(nums, target) {\n  \n}', typescript: 'function search(nums: number[], target: number): number {\n  \n}' },
    hints: ['Classic binary search with left and right pointers.']
  },
  {
    id: 29,
    title: 'Intersection of Two Arrays',
    difficulty: 'Easy',
    categories: ['Array', 'Hash Table', 'Two Pointers', 'Binary Search'],
    description: 'Given two integer arrays nums1 and nums2, return an array of their intersection. Each element in the result must be unique.',
    examples: [{ input: 'nums1 = [1,2,2,1], nums2 = [2,2]', output: '[2]' }],
    testCases: [
      { input: '[1,2,2,1]\n[2,2]', expectedOutput: '[2]' },
      { input: '[4,9,5]\n[9,4,9,8,4]', expectedOutput: '[4,9]' }
    ],
    starterCode: { javascript: 'function intersection(nums1, nums2) {\n  \n}', typescript: 'function intersection(nums1: number[], nums2: number[]): number[] {\n  \n}' },
    hints: ['Use a Set to find unique elements from the first array.']
  },
  {
    id: 30,
    title: 'Guess Number Higher or Lower',
    difficulty: 'Easy',
    categories: ['Binary Search', 'Interactive'],
    description: 'We are playing the Guess Game. I pick a number from 1 to n. You have to guess which number I picked. Use the provided guess(num) API.',
    testCases: [
      { input: '10\n6', expectedOutput: '6' }
    ],
    starterCode: { javascript: '/** \n * Forward declaration of guess API.\n * @param {number} num   your guess\n * @return \t     -1 if num is higher than the picked number\n *\t\t\t      1 if num is lower than the picked number\n *\t\t\t      0 if num is equal to the picked number\n * var guess = function(num) {}\n */\nfunction guessNumber(n) {\n  \n}', typescript: 'function guessNumber(n: number): number {\n  \n}' },
    hints: ['Standard binary search problem.']
  },
  {
    id: 31,
    title: 'Valid Mountain Array',
    difficulty: 'Easy',
    categories: ['Array'],
    description: 'Given an array of integers arr, return true if and only if it is a valid mountain array.',
    examples: [{ input: 'arr = [2,1]', output: 'false' }],
    testCases: [
      { input: '[2,1]', expectedOutput: 'false' },
      { input: '[3,5,5]', expectedOutput: 'false' },
      { input: '[0,3,2,1]', expectedOutput: 'true' }
    ],
    starterCode: { javascript: 'function validMountainArray(arr) {\n  \n}', typescript: 'function validMountainArray(arr: number[]): boolean {\n  \n}' },
    hints: ['Walk up the mountain and then walk down. Check if you reached the end.']
  },
  {
    id: 32,
    title: 'Squares of a Sorted Array',
    difficulty: 'Easy',
    categories: ['Array', 'Two Pointers', 'Sorting'],
    description: 'Given an integer array nums sorted in non-decreasing order, return an array of the squares of each number sorted in non-decreasing order.',
    examples: [{ input: 'nums = [-4,-1,0,3,10]', output: '[0,1,9,16,100]' }],
    testCases: [
      { input: '[-4,-1,0,3,10]', expectedOutput: '[0,1,9,16,100]' }
    ],
    starterCode: { javascript: 'function sortedSquares(nums) {\n  \n}', typescript: 'function sortedSquares(nums: number[]): number[] {\n  \n}' },
    hints: ['Two pointers approach from both ends.']
  },
  {
    id: 33,
    title: 'Sort Array By Parity',
    difficulty: 'Easy',
    categories: ['Array', 'Two Pointers'],
    description: 'Given an integer array nums, move all the even integers at the beginning of the array followed by all the odd integers.',
    examples: [{ input: 'nums = [3,1,2,4]', output: '[2,4,3,1]' }],
    testCases: [
      { input: '[3,1,2,4]', expectedOutput: '[2,4,3,1]' }
    ],
    starterCode: { javascript: 'function sortArrayByParity(nums) {\n  \n}', typescript: 'function sortArrayByParity(nums: number[]): number[] {\n  \n}' },
    hints: ['Two pointer swap or partition logic.']
  },
  {
    id: 34,
    title: 'Replace Elements with Greatest Element on Right Side',
    difficulty: 'Easy',
    categories: ['Array'],
    description: 'Given an array arr, replace every element in that array with the greatest element among the elements to its right, and replace the last element with -1.',
    examples: [{ input: 'arr = [17,18,5,4,6,1]', output: '[18,6,6,6,1,-1]' }],
    testCases: [
      { input: '[17,18,5,4,6,1]', expectedOutput: '[18,6,6,6,1,-1]' }
    ],
    starterCode: { javascript: 'function replaceElements(arr) {\n  \n}', typescript: 'function replaceElements(arr: number[]): number[] {\n  \n}' },
    hints: ['Traversing from right to left makes this O(n).']
  },
  {
    id: 35,
    title: 'Check If N and Its Double Exist',
    difficulty: 'Easy',
    categories: ['Array', 'Hash Table', 'Two Pointers', 'Binary Search'],
    description: 'Given an array arr of integers, check if there exist two indices i and j such that i != j and arr[i] == 2 * arr[j].',
    examples: [{ input: 'arr = [10,2,5,3]', output: 'true' }],
    testCases: [
      { input: '[10,2,5,3]', expectedOutput: 'true' },
      { input: '[3,1,7,11]', expectedOutput: 'false' }
    ],
    starterCode: { javascript: 'function checkIfExist(arr) {\n  \n}', typescript: 'function checkIfExist(arr: number[]): boolean {\n  \n}' },
    hints: ['Use a hash set to store numbers and look up for double or half values.']
  },
  {
    id: 36,
    title: 'Max Consecutive Ones',
    difficulty: 'Easy',
    categories: ['Array'],
    description: 'Given a binary array nums, return the maximum number of consecutive 1\'s in the array.',
    testCases: [
      { input: '[1,1,0,1,1,1]', expectedOutput: '3' }
    ],
    starterCode: { javascript: 'function findMaxConsecutiveOnes(nums) {\n  \n}', typescript: 'function findMaxConsecutiveOnes(nums: number[]): number {\n  \n}' },
    hints: ['Maintain a counter and reset it when you see a 0.']
  },
  {
    id: 37,
    title: 'Find Numbers with Even Number of Digits',
    difficulty: 'Easy',
    categories: ['Array'],
    description: 'Given an array nums of integers, return how many of them contain an even number of digits.',
    testCases: [
      { input: '[12,345,2,6,7896]', expectedOutput: '2' }
    ],
    starterCode: { javascript: 'function findNumbers(nums) {\n  \n}', typescript: 'function findNumbers(nums: number[]): number {\n  \n}' },
    hints: ['Convert number to string to check length or use math.']
  },
  {
    id: 38,
    title: 'Duplicate Zeros',
    difficulty: 'Easy',
    categories: ['Array', 'Two Pointers'],
    description: 'Given a fixed-length integer array arr, duplicate each occurrence of zero, shifting the remaining elements to the right.',
    examples: [{ input: 'arr = [1,0,2,3,0,4,5,0]', output: '[1,0,0,2,3,0,0,4]' }],
    testCases: [
      { input: '[1,0,2,3,0,4,5,0]', expectedOutput: '[1,0,0,2,3,0,0,4]' }
    ],
    starterCode: { javascript: 'function duplicateZeros(arr) {\n  \n}', typescript: 'function duplicateZeros(arr: number[]): void {\n  \n}' },
    hints: ['Think about the offset. Count zeros first.']
  },
  {
    id: 39,
    title: 'Valid Sudoku',
    difficulty: 'Medium',
    categories: ['Array', 'Hash Table'],
    description: 'Determine if a 9 x 9 Sudoku board is valid. Only the filled cells need to be validated according to the Sudoku rules.',
    starterCode: { javascript: 'function isValidSudoku(board) {\n  \n}', typescript: 'function isValidSudoku(board: string[][]): boolean {\n  \n}' },
    testCases: [{ input: '[["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]', expectedOutput: 'true' }],
    hints: ['Track used numbers for each row, column and 3x3 block.']
  },
  {
    id: 40,
    title: 'Rotate Image',
    difficulty: 'Medium',
    categories: ['Array', 'Math'],
    description: 'You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise) in-place.',
    starterCode: { javascript: 'function rotate(matrix) {\n  \n}', typescript: 'function rotate(matrix: number[][]): void {\n  \n}' },
    testCases: [
      { input: '[[1,2,3],[4,5,6],[7,8,9]]', expectedOutput: '[[7,4,1],[8,5,2],[9,6,3]]' }
    ],
    hints: ['Transpose then reverse each row.']
  },
  {
    id: 41,
    title: 'Group Anagrams',
    difficulty: 'Medium',
    categories: ['Array', 'Hash Table', 'String', 'Sorting'],
    description: 'Given an array of strings strs, group the anagrams together. You can return the answer in any order.',
    starterCode: { javascript: 'function groupAnagrams(strs) {\n  \n}', typescript: 'function groupAnagrams(strs: string[]): string[][] {\n  \n}' },
    testCases: [
      { input: '["eat","tea","tan","ate","nat","bat"]', expectedOutput: '[["eat","tea","ate"],["tan","nat"],["bat"]]' }
    ],
    hints: ['Use sorted strings as keys in a hash map.']
  },
  {
    id: 42,
    title: 'Container With Most Water',
    difficulty: 'Medium',
    categories: ['Array', 'Two Pointers'],
    description: 'Given n non-negative integers a1, a2, ..., an, where each represents a point at coordinate (i, ai). Find two lines that together with the x-axis forms a container, such that the container contains the most water.',
    starterCode: { javascript: 'function maxArea(height) {\n  \n}', typescript: 'function maxArea(height: number[]): number {\n  \n}' },
    testCases: [
      { input: '[1,8,6,2,5,4,8,3,7]', expectedOutput: '49' }
    ],
    hints: ['Two pointers starting from both ends. Move the pointer pointing to the shorter line.']
  },
  {
    id: 43,
    title: '3Sum',
    difficulty: 'Medium',
    categories: ['Array', 'Two Pointers', 'Sorting'],
    description: 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.',
    starterCode: { javascript: 'function threeSum(nums) {\n  \n}', typescript: 'function threeSum(nums: number[]): number[][] {\n  \n}' },
    testCases: [
      { input: '[-1,0,1,2,-1,-4]', expectedOutput: '[[-1,-1,2],[-1,0,1]]' }
    ],
    hints: ['Sort the array, then iterate through and use two pointers for the remaining sum.']
  },
  {
    id: 44,
    title: 'Search in Rotated Sorted Array',
    difficulty: 'Medium',
    categories: ['Array', 'Binary Search'],
    description: 'Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.',
    starterCode: { javascript: 'function search(nums, target) {\n  \n}', typescript: 'function search(nums: number[], target: number): number {\n  \n}' },
    testCases: [
      { input: '[4,5,6,7,0,1,2]\n0', expectedOutput: '4' }
    ],
    hints: ['Decide which part is sorted and then apply binary search.']
  },
  {
    id: 45,
    title: 'Find First and Last Position of Element in Sorted Array',
    difficulty: 'Medium',
    categories: ['Array', 'Binary Search'],
    description: 'Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value.',
    starterCode: { javascript: 'function searchRange(nums, target) {\n  \n}', typescript: 'function searchRange(nums: number[], target: number): number[] {\n  \n}' },
    testCases: [
      { input: '[5,7,7,8,8,10]\n8', expectedOutput: '[3,4]' }
    ],
    hints: ['Run binary search twice, once for the first occurrence and once for the last.']
  },
  {
    id: 46,
    title: 'Search Insert Position',
    difficulty: 'Easy',
    categories: ['Array', 'Binary Search'],
    description: 'Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.',
    starterCode: { javascript: 'function searchInsert(nums, target) {\n  \n}', typescript: 'function searchInsert(nums: number[], target: number): number {\n  \n}' },
    testCases: [
      { input: '[1,3,5,6]\n5', expectedOutput: '2' },
      { input: '[1,3,5,6]\n2', expectedOutput: '1' }
    ],
    hints: ['Binary search and return the left pointer.']
  },
  {
    id: 47,
    title: 'Merge Intervals',
    difficulty: 'Medium',
    categories: ['Array', 'Sorting'],
    description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.',
    starterCode: { javascript: 'function merge(intervals) {\n  \n}', typescript: 'function merge(intervals: number[][]): number[][] {\n  \n}' },
    testCases: [
      { input: '[[1,3],[2,6],[8,10],[15,18]]', expectedOutput: '[[1,6],[8,10],[15,18]]' }
    ],
    hints: ['Sort by start time and merge greedily.']
  },
  {
    id: 48,
    title: 'Spiral Matrix',
    difficulty: 'Medium',
    categories: ['Array', 'Simulation'],
    description: 'Given an m x n matrix, return all elements of the matrix in spiral order.',
    starterCode: { javascript: 'function spiralOrder(matrix) {\n  \n}', typescript: 'function spiralOrder(matrix: number[][]): number[] {\n  \n}' },
    testCases: [
      { input: '[[1,2,3],[4,5,6],[7,8,9]]', expectedOutput: '[1,2,3,6,9,8,7,4,5]' }
    ],
    hints: ['Track boundaries (top, bottom, left, right).']
  },
  {
    id: 49,
    title: 'Jump Game',
    difficulty: 'Medium',
    categories: ['Array', 'Dynamic Programming', 'Greedy'],
    description: 'Each element in the array represents your maximum jump length at that position. Determine if you can reach the last index.',
    starterCode: { javascript: 'function canJump(nums) {\n  \n}', typescript: 'function canJump(nums: number[]): boolean {\n  \n}' },
    testCases: [
      { input: '[2,3,1,1,4]', expectedOutput: 'true' },
      { input: '[3,2,1,0,4]', expectedOutput: 'false' }
    ],
    hints: ['Keep track of the maximum reachable index.']
  },
  {
    id: 50,
    title: 'Unique Paths',
    difficulty: 'Medium',
    categories: ['Math', 'Dynamic Programming', 'Combinatorics'],
    description: 'A robot is on an m x n grid. The robot can only move either down or right at any point in time. How many possible unique paths are there?',
    starterCode: { javascript: 'function uniquePaths(m, n) {\n  \n}', typescript: 'function uniquePaths(m: number, n: number): number {\n  \n}' },
    testCases: [
      { input: '3\n7', expectedOutput: '28' }
    ],
    hints: ['This can be solved using Dynamic Programming or combinatorics (nCr).']
  }
];

async function loadProblems() {
  return problems;
}


function slugify(title: string): string {
  return title.toLowerCase().replace(/\s+/g, '-')
}

const prisma = new PrismaClient()

async function main() {
  const problems = await loadProblems()

  console.log(`Seeding ${problems.length} problems...`)

  for (const problem of problems) {
    await prisma.problem.upsert({
      where: { id: problem.id },
      update: {
        title: problem.title,
        slug: slugify(problem.title),
        difficulty: problem.difficulty || 'Easy',
        categories: problem.categories || [],
        description: problem.description || '',
        examples: (problem.examples as any) || [],
        constraints: problem.constraints || [],
        testCases: (problem.testCases as any) || [],
        starterCode: (problem.starterCode as any) || {},
        hints: problem.hints || [],
      },
      create: {
        id: problem.id,
        title: problem.title,
        slug: slugify(problem.title),
        difficulty: problem.difficulty || 'Easy',
        categories: problem.categories || [],
        description: problem.description || '',
        examples: (problem.examples as any) || [],
        constraints: problem.constraints || [],
        testCases: (problem.testCases as any) || [],
        starterCode: (problem.starterCode as any) || {},
        hints: problem.hints || [],
      },
    })
  }

  console.log(`Seeded ${problems.length} problems successfully.`)
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
