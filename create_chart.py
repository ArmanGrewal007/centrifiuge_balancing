import plotly.express as px

# Create a sample chart
df = px.data.gapminder().query("year == 2007")
fig = px.scatter(df, x="gdpPercap", y="lifeExp", size="pop", color="continent", 
                 hover_name="country", log_x=True, size_max=60)

# Export to an HTML file
fig.write_html("chart.html")

print("Chart saved as 'chart.html'")
