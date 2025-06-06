export interface Topic {
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


export default topics