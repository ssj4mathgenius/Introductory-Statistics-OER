import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import uniform
from matplotlib.ticker import MultipleLocator

# Define the parameters of the uniform distribution
start = 123  # Lower bound
width = 125 - 123  # Range (upper bound - lower bound)

# Generate x values (for the range 123 to 125)
x = np.linspace(start - 0.2, 125 + 0.2, 500)  # Extra range to show the boundaries clearly

# Calculate the PDF (Probability Density Function) of the uniform distribution
pdf = uniform.pdf(x, loc=start, scale=width)

# Plot the uniform distribution
plt.figure(figsize=(10, 5))
plt.plot(x, pdf, label=f"Distribution of Voltage Levels")
plt.fill_between(x, pdf, alpha=0.2, color='blue')  # Shade the entire area under the curve

# Add shading for the region between 123 and 123.7
x_shaded = x[(x >= 123) & (x <= 123.7)]  # Limit x values to the desired range
pdf_shaded = uniform.pdf(x_shaded, loc=start, scale=width)  # Calculate PDF for this range
plt.fill_between(x_shaded, pdf_shaded, alpha=0.5, color='orange', label="Region 123 to 123.7")

# Add plot details
plt.title("Distribution of Voltage Levels")
plt.xlabel("Voltage Levels (kWh)")
plt.ylabel("Probability Density")
plt.axhline(0, color="black", linewidth=0.5)
#plt.axvline(start, linestyle="--", color="red", label="Start (123)")
#plt.axvline(125, linestyle="--", color="green", label="End (125)")


# Set the x-axis major ticks to every 0.2 units
plt.gca().xaxis.set_major_locator(MultipleLocator(0.2))

ax = plt.gca()  # Get the current axes
ax.spines['top'].set_visible(False)  # Remove the top border
ax.spines['right'].set_visible(False)  # Remove the right border
ax.spines['left'].set_visible(False)
ax.spines['bottom'].set_visible(False)

# Set x-axis ticks to show only 123 and 123.7
plt.xticks([123, 123.7], labels=["123", "123.7"])

# Add legend and show plot
#plt.grid(True)
#plt.legend()
plt.show()
