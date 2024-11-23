import math
from itertools import product
from multiprocessing import Pool


# Function to check if the centrifuge is balanced
def balanced(centrifuge):
    n = len(centrifuge)
    TWO_PI = 2 * math.pi

    x, y = 0.0, 0.0
    for t, v in enumerate(centrifuge):
        if v == 0:  # Skip if no mass
            continue
        angle = v * TWO_PI * (t + 1) / n
        x += math.cos(angle)
        y += math.sin(angle)

    # Calculate the magnitude of the center of mass
    return round(math.hypot(x, y) * 10) / 10 == 0.0


# Function to process a single size
def process_size(val):
    total_combinations = 0
    balanced_count = 0

    for combo in product([0, 1], repeat=val):
        total_combinations += 1
        if balanced(combo):
            balanced_count += 1

    avg = (balanced_count / total_combinations) * 100
    return val, balanced_count, total_combinations, avg


# Main function
if __name__ == "__main__":
    import time
    start_time = time.time()

    rng = range(2, 20)  # Range of sizes to process
    with Pool(processes=4) as pool:
        results = pool.map(process_size, rng)

    for val, balanced_count, total_combinations, avg in results:
        print(f"{val} => {balanced_count}/{total_combinations} => {avg:.3f}%")

    print(f"Time taken: {time.time() - start_time:.2f} seconds")
