// src/app/learn/page.tsx
'use client';
import {useState} from 'react';
import PageTransition from '@/components/PageTransition/PageTransition';
import Navbar from "@/components/Navbar/Navbar";

interface Topic {
    id: string;
    title: string;
    definition: string;
    codeExamples: Array<{
        title: string;
        code: string;
        explanation: string;
    }>;
    keyPoints: string[];
}

const topics: Topic[] = [
    {
        id: 'variables',
        title: 'Variables',
        definition: 'Variables are containers that store data values. In C, every variable must be declared with a specific data type before it can be used. Variables allow you to store, modify, and retrieve data throughout your program.',
        codeExamples: [
            {
                title: 'Basic Variable Declaration',
                code: `int age = 25;           // Integer variable
float price = 19.99;     // Floating point variable
char grade = 'A';        // Character variable
char name[50] = "John";  // String (character array)`,
                explanation: 'Here we declare variables of different types. Each variable has a type, name, and optionally an initial value.'
            },
            {
                title: 'Variable Usage',
                code: `#include &lt;stdio.h&gt;

int main() {
    int x = 10;
    int y = 20;
    int sum = x + y;
    
    printf("Sum: %d\\n", sum);
    return 0;
}`,
                explanation: 'This example shows how to use variables in calculations and print their values.'
            }
        ],
        keyPoints: [
            'Variables must be declared before use',
            'Each variable has a specific data type',
            'Variable names are case-sensitive',
            'Use descriptive names for better code readability'
        ]
    },
    {
        id: 'data-types',
        title: 'Data Types',
        definition: 'Data types specify the type of data that a variable can store. C provides several built-in data types including integers, floating-point numbers, characters, and more. Each data type has a specific size and range of values.',
        codeExamples: [
            {
                title: 'Basic Data Types',
                code: `int number = 42;           // 4 bytes, -2³¹ to 2³¹-1
float decimal = 3.14f;     // 4 bytes, ~7 decimal digits
double precise = 3.141592; // 8 bytes, ~15 decimal digits
char letter = 'C';         // 1 byte, single character
_Bool flag = 1;            // 1 byte, true(1) or false(0)`,
                explanation: 'Different data types have different sizes and purposes. Choose the appropriate type based on your data needs.'
            },
            {
                title: 'Data Type Sizes',
                code: `#include &lt;stdio.h&gt;

int main() {
    printf("int: %zu bytes\\n", sizeof(int));
    printf("float: %zu bytes\\n", sizeof(float));
    printf("double: %zu bytes\\n", sizeof(double));
    printf("char: %zu bytes\\n", sizeof(char));
    return 0;
}`,
                explanation: 'The sizeof operator returns the size of a data type in bytes. This helps understand memory usage.'
            }
        ],
        keyPoints: [
            'int: whole numbers (-2,147,483,648 to 2,147,483,647)',
            'float: decimal numbers with ~7 digits precision',
            'double: decimal numbers with ~15 digits precision',
            'char: single characters (letters, digits, symbols)',
            '_Bool: true/false values (1/0)'
        ]
    },
    {
        id: 'loops',
        title: 'Loops',
        definition: 'Loops allow you to execute a block of code repeatedly. C provides three types of loops: for, while, and do-while. Each loop type is useful in different scenarios depending on when you know how many iterations you need.',
        codeExamples: [
            {
                title: 'For Loop',
                code: `#include &lt;stdio.h&gt;

int main() {
    // Print numbers 1 to 5
    for (int i = 1; i <= 5; i++) {
        printf("Number: %d\\n", i);
    }
    return 0;
}`,
                explanation: 'For loops are ideal when you know exactly how many times you want to repeat something.'
            },
            {
                title: 'While Loop',
                code: `#include &lt;stdio.h&gt;

int main() {
    int count = 0;
    
    while (count < 3) {
        printf("Count: %d\\n", count);
        count++;
    }
    return 0;
}`,
                explanation: 'While loops continue executing as long as the condition is true. Check the condition before each iteration.'
            },
            {
                title: 'Do-While Loop',
                code: `#include &lt;stdio.h&gt;

int main() {
    int number;
    
    do {
        printf("Enter a positive number: ");
        scanf("%d", &number);
    } while (number <= 0);
    
    printf("You entered: %d\\n", number);
    return 0;
}`,
                explanation: 'Do-while loops execute at least once, then check the condition. Useful for input validation.'
            }
        ],
        keyPoints: [
            'for: Use when you know the number of iterations',
            'while: Use when the condition is checked before execution',
            'do-while: Use when you need at least one execution',
            'Always ensure the loop condition will eventually become false'
        ]
    },
    {
        id: 'functions',
        title: 'Functions',
        definition: 'Functions are reusable blocks of code that perform specific tasks. They help organize code, avoid repetition, and make programs more modular. Functions can take parameters (inputs) and return values (outputs).',
        codeExamples: [
            {
                title: 'Basic Function',
                code: `#include &lt;stdio.h&gt;

// Function declaration
int add(int a, int b);

int main() {
    int result = add(5, 3);
    printf("Result: %d\\n", result);
    return 0;
}

// Function definition
int add(int a, int b) {
    return a + b;
}`,
                explanation: 'This function takes two integers as parameters and returns their sum. Notice the declaration before main().'
            },
            {
                title: 'Void Function',
                code: `#include &lt;stdio.h&gt;

void greetUser(char name[]) {
    printf("Hello, %s!\\n", name);
    printf("Welcome to C programming!\\n");
}

int main() {
    greetUser("Alice");
    greetUser("Bob");
    return 0;
}`,
                explanation: 'Void functions perform actions but don\'t return a value. They\'re useful for displaying information or performing operations.'
            }
        ],
        keyPoints: [
            'Functions must be declared before they are used',
            'Use descriptive function names that explain what they do',
            'Parameters allow functions to work with different data',
            'Return values let functions provide results back to the caller',
            'main() is a special function where program execution begins'
        ]
    },
    {
        id: 'arrays',
        title: 'Arrays',
        definition: 'Arrays are collections of elements of the same data type stored in contiguous memory locations. They allow you to store multiple values under a single variable name and access them using an index. Array indices start from 0.',
        codeExamples: [
            {
                title: 'Array Declaration and Initialization',
                code: `#include &lt;stdio.h&gt;

int main() {
    // Different ways to declare arrays
    int numbers[5] = {1, 2, 3, 4, 5};
    int grades[] = {85, 92, 78, 95, 88}; // Size inferred
    char vowels[5] = {'a', 'e', 'i', 'o', 'u'};
    
    printf("First number: %d\\n", numbers[0]);
    printf("Last grade: %d\\n", grades[4]);
    return 0;
}`,
                explanation: 'Arrays can be initialized with values in curly braces. The size can be specified or inferred from the number of elements.'
            },
            {
                title: 'Array Iteration',
                code: `#include &lt;stdio.h&gt;

int main() {
    int scores[4] = {85, 92, 78, 95};
    int sum = 0;
    
    // Calculate average score
    for (int i = 0; i < 4; i++) {
        sum += scores[i];
        printf("Score %d: %d\\n", i+1, scores[i]);
    }
    
    printf("Average: %.2f\\n", sum / 4.0);
    return 0;
}`,
                explanation: 'Use loops to iterate through arrays. This example calculates and displays the average of test scores.'
            }
        ],
        keyPoints: [
            'Array indices start from 0 and go to (size - 1)',
            'All elements in an array must be the same data type',
            'Array size must be known at compile time',
            'Accessing beyond array bounds causes undefined behavior',
            'Use loops to efficiently process array elements'
        ]
    },
    {
        id: 'pointers',
        title: 'Pointers',
        definition: 'Pointers are variables that store memory addresses of other variables. They provide a way to indirectly access and manipulate data. Pointers are powerful but require careful handling to avoid common programming errors.',
        codeExamples: [
            {
                title: 'Basic Pointer Usage',
                code: `#include &lt;stdio.h&gt;

int main() {
    int number = 42;
    int *ptr = &number;  // ptr stores address of number
    
    printf("Value of number: %d\\n", number);
    printf("Address of number: %p\\n", (void*)&number);
    printf("Value of ptr: %p\\n", (void*)ptr);
    printf("Value pointed by ptr: %d\\n", *ptr);
    
    return 0;
}`,
                explanation: 'The & operator gets the address of a variable. The * operator dereferences a pointer to get the value it points to.'
            },
            {
                title: 'Pointer Arithmetic',
                code: `#include &lt;stdio.h&gt;

int main() {
    int arr[3] = {10, 20, 30};
    int *ptr = arr;  // Points to first element
   
    for (int i = 0; i < 3; i++) {
        printf("Element %d: %d\\n", i, *(ptr + i));
    }
   
    return 0;
}`,
                explanation: 'Pointers can be used with arithmetic to navigate through arrays. ptr + i moves to the i-th element.'
            }
        ],
        keyPoints: [
            '& operator gets the address of a variable',
            '* operator dereferences a pointer (gets the value)',
            'Pointer arithmetic allows navigation through arrays',
            'Always initialize pointers before use',
            'Be careful with pointer arithmetic to avoid memory errors'
        ]
    }
];

export default function LearnPage() {
    const [selectedTopic, setSelectedTopic] = useState<Topic>(topics[0]);

    const highlightSyntax = (code: string) => {
        return code;
    };

    return (
        <PageTransition>
            <div>
                <Navbar/>

                <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">

                    {/* Header Section */}
                    <div className="pt-8 pb-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center">
                                <h1 className="text-4xl font-bold text-white mb-2">
                                    Learn <span
                                    className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">C Programming</span>
                                </h1>
                                <p className="text-gray-300 text-lg">
                                    Master the fundamentals of C programming with interactive examples
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                        <div className="grid lg:grid-cols-4 gap-8">

                            {/* Sidebar - Topic List */}
                            <div className="lg:col-span-1">
                                <div
                                    className="bg-gray-800/40 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 p-6 sticky top-24">
                                    <h2 className="text-lg font-bold text-white mb-4">Topics</h2>
                                    <nav className="space-y-2">
                                        {topics.map((topic) => (
                                            <button
                                                key={topic.id}
                                                onClick={() => setSelectedTopic(topic)}
                                                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
                                                    selectedTopic.id === topic.id
                                                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                                                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                                                }`}
                                            >
                                                {topic.title}
                                            </button>
                                        ))}
                                    </nav>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="lg:col-span-3">
                                <div
                                    className="bg-gray-800/40 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">

                                    {/* Topic Header */}
                                    <div className="px-8 py-6 border-b border-gray-700/50 bg-gray-800/60">
                                        <h1 className="text-3xl font-bold text-white mb-2">{selectedTopic.title}</h1>
                                 
                                    </div>

                                    <div className="p-8 space-y-8">

                                        {/* Definition Section */}
                                        <div>
                                            <h2 className="text-xl font-semibold text-blue-400 mb-4 flex items-center">
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor"
                                                     viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                </svg>
                                                Definition
                                            </h2>
                                            <p className="text-gray-300 leading-relaxed text-lg bg-gray-900/30 p-6 rounded-xl border border-gray-700/30">
                                                {selectedTopic.definition}
                                            </p>
                                        </div>

                                        {/* Code Examples Section */}
                                        <div>
                                            <h2 className="text-xl font-semibold text-green-400 mb-6 flex items-center">
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor"
                                                     viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                                                </svg>
                                                Code Examples
                                            </h2>

                                            <div className="space-y-6">
                                                {selectedTopic.codeExamples.map((example, index) => (
                                                    <div key={index}
                                                         className="bg-gray-900/50 rounded-xl border border-gray-700/50 overflow-hidden">

                                                        {/* Example Header */}
                                                        <div
                                                            className="px-6 py-4 bg-gray-800/70 border-b border-gray-700/50">
                                                            <h3 className="font-semibold text-white">{example.title}</h3>
                                                        </div>

                                                        {/* Code Block */}
                                                        <div className="p-6">
                                                            <div
                                                                className="bg-gray-900 rounded-lg p-6 mb-4 border border-gray-700/30">
                              <pre className="text-sm overflow-x-auto">
                                <code
                                    className="text-gray-200 font-mono leading-relaxed"
                                    dangerouslySetInnerHTML={{__html: highlightSyntax(example.code)}}
                                />
                              </pre>
                                                            </div>

                                                            {/* Explanation */}
                                                            <div
                                                                className="bg-blue-900/20 border-l-4 border-blue-400 p-4 rounded-r-lg">
                                                                <p className="text-gray-300 leading-relaxed">
                                                                <span
                                                                    className="text-blue-400 font-medium">Explanation: </span>
                                                                    {example.explanation}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Key Points Section */}
                                        <div>
                                            <h2 className="text-xl font-semibold text-purple-400 mb-4 flex items-center">
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor"
                                                     viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                </svg>
                                                Key Points
                                            </h2>
                                            <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-700/30">
                                                <ul className="space-y-3">
                                                    {selectedTopic.keyPoints.map((point, index) => (
                                                        <li key={index} className="flex items-start text-gray-300">
                                                            <div
                                                                className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                                            <span className="leading-relaxed">{point}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Practice Suggestion */}
                                        <div
                                            className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-500/30">
                                            <div className="flex items-center mb-3">
                                                <svg className="w-6 h-6 text-yellow-400 mr-3" fill="none"
                                                     stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                                </svg>
                                                <h3 className="text-lg font-semibold text-white">Ready to Practice?</h3>
                                            </div>
                                            <p className="text-gray-300 mb-4">
                                                Now that you've learned about {selectedTopic.title.toLowerCase()}, try
                                                solving some coding problems to reinforce your understanding!
                                            </p>
                                            <a
                                                href="/problems"
                                                className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                                            >
                                                Practice Problems
                                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor"
                                                     viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M9 5l7 7-7 7"/>
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}