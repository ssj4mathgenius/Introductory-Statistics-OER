import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import uniform
from matplotlib.ticker import MultipleLocator

# Define the parameters of the uniform distribution
start = 45  # Lower bound
end = 57
width = end - start  # Range (upper bound - lower bound)
ticks = 1
shadestart = 49
shadeend = 53
height = 0.083

# Generate x values (for the range 123 to 125)
x = np.linspace(start - 1, end + 1, 100)  # Extra range to show the boundaries clearly

# Calculate the PDF (Probability Density Function) of the uniform distribution
pdf = uniform.pdf(x, loc=start, scale=width)

# Plot the uniform distribution
plt.figure(figsize=(8, 4))
plt.plot(x, pdf, label=f"Distribution of Class Lengths")
plt.fill_between(x, pdf, alpha=0.2, color='white')  # Shade the entire area under the curve

# Add shading for the region between shadestart and shadeend
x_shaded = x[(x >= shadestart) & (x <= shadeend)]  # Limit x values to the desired range
pdf_shaded = uniform.pdf(x_shaded, loc=start, scale=width)  # Calculate PDF for this range
plt.fill_between(x_shaded, pdf_shaded, alpha=0.5, color='orange', label=f"Region {shadestart} to {shadeend}")

# Add plot details
plt.title("Distribution of Class Lengths")
plt.xlabel("Class Lengths")
plt.ylabel("Probability Density")
plt.axhline(0, color="black", linewidth=0.5)
#plt.axvline(start, linestyle="--", color="", label=f"Start ({start})")
# plt.axvline(end, linestyle="--", color="", label=f"End ({end})")


# Set the x-axis major ticks to every "ticks" units
plt.gca().xaxis.set_major_locator(MultipleLocator(ticks))

# Toggle the x and y axises off and on as needed
#plt.gca().axes.xaxis.set_visible(False)
#plt.gca().axes.yaxis.set_visible(False)


ax = plt.gca()  # Get the current axes
ax.spines['top'].set_visible(False)  # Remove the top border
ax.spines['right'].set_visible(False)  # Remove the right border
#ax.spines['left'].set_visible(False)
ax.spines['bottom'].set_visible(False)

# Set x-axis and y-axis ticks to show only particular ticks
plt.xticks([start, shadestart, shadeend, end], labels=[f"{start}",f"{shadestart}",f"{shadeend}",f"{end}"])
plt.yticks([0 , height], labels=["0",f"{height}"])

# Specify the path to save the file
file_path = "../images/uniformclasstimes3.png"

# Save the plot to the specified location
plt.savefig(file_path, format="png", dpi=300, bbox_inches="tight")

print(f"Plot saved to {file_path}")

# Add legend and show plot
#plt.grid(True)
#plt.legend()
plt.show()
