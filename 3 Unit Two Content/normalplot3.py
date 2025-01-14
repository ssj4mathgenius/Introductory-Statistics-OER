import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import norm
from matplotlib.ticker import MultipleLocator

# Define the mean and standard deviation
mu = 0
sigma = 1
start = mu-4*sigma
end = mu+4*sigma
shadestart = start
shadeend=1.28

# Generate x values
x = np.linspace(start, end, 1000)

# Compute the PDF
y = norm.pdf(x, loc=mu, scale=sigma)

# Plot the normal distribution
plt.figure(figsize=(7, 4))
plt.plot(x, y, label='Normal Distribution', color='blue')

ax = plt.gca()  # Get the current axes

# Limit the x-axis to display only from start to end
ax.set_xlim(start, end)

# Remove the y-axis
ax.yaxis.set_visible(False)  # Hides the y-axis ticks and labels
ax.spines['left'].set_visible(False)  # Hides the left spine

# Remove the top and right borders
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)

# Add labels and title
ax.set_title('')
ax.set_xlabel('')
# ax.set_ylabel('Probability Density')

# Shade the region from start to 1.25
x_shaded = np.linspace(shadestart, shadeend, 500)  # Generate x values for shading
y_shaded = norm.pdf(x_shaded, loc=mu, scale=sigma)  # Corresponding y values
plt.fill_between(x_shaded, y_shaded, color='blue', alpha=0.5, label='Shaded Region')

# Add text to indicate the shaded area
plt.text(start + 1.5, max(y) * 0.7, "Area = 0.90", fontsize=10, color='black', ha='center')

# Add an arrow with an adjusted tip
arrow_size = 0.1  # Length of the arrow
x_left_arrow=start+arrow_size
y_left_arrow = (1 / np.sqrt(2 * np.pi)) * np.exp(-0.5 * x_left_arrow**2)
x_right_arrow=end-arrow_size
y_right_arrow = (1 / np.sqrt(2 * np.pi)) * np.exp(-0.5 * x_right_arrow**2)

delta_x = 0.1  # Small adjustment for the arrow in x
delta_y = 0.0005  # Small adjustment for the arrow in y
ax.annotate('', 
            xy=(x_right_arrow + delta_x, y_right_arrow + delta_y ),  # Slightly move the arrow tip
            xytext=(x_right_arrow - arrow_size + delta_x, y_right_arrow + delta_y),  # Arrow tail 
            arrowprops=dict(facecolor='black', shrink=0.08, headwidth=10, headlength=12))
ax.annotate('', xy=(x_left_arrow - delta_x, y_left_arrow + delta_y), xytext=(x_left_arrow + arrow_size-delta_x, y_left_arrow+delta_y),
            arrowprops=dict(facecolor='black', shrink=0.08, headwidth=10, headlength=12))

# Set x-axis and y-axis ticks to show only particular ticks
plt.xticks([0,shadeend], labels=["0","z"])

# Add a dotted line at x = 0 going to the peak of the curve
ax.plot([0, 0], [0, max(y)], linestyle='--', color='red', linewidth=1.5, label=f'{mu}')

# Specify the path to save the file
file_path = "../images/normalplot3.png"

# Save the plot to the specified location
plt.savefig(file_path, format="png", dpi=300, bbox_inches="tight")

print(f"Plot saved to {file_path}")

# Display the plot
plt.show()
