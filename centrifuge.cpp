#include <iostream>
#include <vector>
#include <cmath>
#include <iomanip>
#include <thread>
#include <mutex>
#include <map>
#include <chrono>

// Mutex for thread-safe access to the map
std::mutex map_mutex;
std::map<int, std::tuple<int, int, double>> results_map;

// Function to check if the centrifuge is balanced
bool balanced(const std::vector<int>& centrifuge) {
    int n = centrifuge.size();
    std::vector<double> mapped;

    // Map positions to angles
    for (int t = 0; t < n; ++t) {
        if (centrifuge[t] == 0) continue; // Skip if no mass
        mapped.push_back(centrifuge[t] * 2 * M_PI * (t + 1) / n);
    }

    // Calculate the center of mass
    double x = 0.0, y = 0.0;
    for (double angle : mapped) {
        x += cos(angle);
        y += sin(angle);
    }

    // Calculate the magnitude of the center of mass
    double com_of_all_tt = round(hypot(x, y) * 10) / 10;

    // Check if the center of mass is at (0, 0)
    return com_of_all_tt == 0.0;
}

// Function to generate combinations and calculate balanced percentage for a given size
void processSize(int size) {
    int totalCombinations = 1 << size; // 2^size combinations
    int count = 0;

    for (int i = 0; i < totalCombinations; ++i) {
        std::vector<int> combo;
        for (int j = 0; j < size; ++j) {
            combo.push_back((i & (1 << j)) ? 1 : 0);
        }

        if (balanced(combo)) {
            count++;
        }
    }

    // Calculate percentage of balanced combinations
    double percentage = (count / static_cast<double>(totalCombinations)) * 100;

    // Store the results in the map
    {
        std::lock_guard<std::mutex> lock(map_mutex);
        results_map[size] = {count, totalCombinations, percentage};
    }
}

int main() {
    const int max_length = 26; // Maximum size to process
    std::vector<std::thread> threads;

    auto start_time = std::chrono::high_resolution_clock::now();

    // Launch threads for each size
    for (int size = 2; size <= max_length; ++size) {
        threads.emplace_back(processSize, size);
    }

    // Wait for all threads to finish
    for (auto& thread : threads) {
        thread.join();
    }

    auto end_time = std::chrono::high_resolution_clock::now();
    double duration = std::chrono::duration_cast<std::chrono::milliseconds>(end_time - start_time).count() / 1000.0;

    // Print the stored results
    for (const auto& [size, data] : results_map) {
        auto [balanced_count, total_count, percentage] = data;
        std::cout << size << " => " << balanced_count << "/" << total_count 
                  << " => " << std::fixed << std::setprecision(3) << percentage << "%\n";
    }

    std::cout << "Time taken: " << duration << " seconds\n";
    return 0;
}




/**
 * @brief 
 * 
g++ -O3 -std=c++17 -pthread centrifuge.cpp -o centrifuge && ./centrifuge
 * 
 */