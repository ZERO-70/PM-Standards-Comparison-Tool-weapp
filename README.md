# PM Standards Comparison Tool

A modern, responsive React web application for comparing and analyzing Project Management Standards: PMBOK 7th Edition, PRINCE2, and ISO 21500/21502.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

## 🎯 Features

### 📚 Standards Repository
- **Comprehensive Library**: Browse all three standards with organized sections
- **Full-Text Search**: Search across titles, content, and categories with highlighting
- **Advanced Filtering**: Filter by standard type (PMBOK, PRINCE2, ISO)
- **Expandable Content**: Read full section content with expand/collapse functionality
- **Smart Bookmarking**: Save sections to localStorage for quick access

### 🔄 Comparison Engine
- **Side-by-Side Analysis**: Compare topics across all three standards simultaneously
- **Category-Based Comparison**: Select topics like Risk Management, Stakeholder Engagement, etc.
- **Keyword Highlighting**: Automatically highlights key project management terms
- **Deep Linking**: Navigate directly to full sections in the repository
- **Quick Analysis**: Built-in analysis of common themes and differences

### 📊 Insights Dashboard
- **Comprehensive Analytics**: Overview statistics and coverage analysis
- **Similarity Analysis**: Identify common themes across standards
- **Difference Mapping**: Understand key variations between approaches
- **Unique Features**: Discover distinctive aspects of each standard
- **Export Functionality**: Download analysis as JSON or copy to clipboard

### 🔖 Bookmarks Management
- **Personal Library**: Save favorite sections for quick reference
- **Category Organization**: Filter bookmarks by topic categories
- **Standard Grouping**: View bookmarks organized by standard
- **Easy Management**: Add/remove bookmarks with single clicks

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone or extract the project**:
   ```bash
   cd pm-standards-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 🏗️ Project Structure

```
src/
├── components/ui/          # Reusable UI components (shadcn/ui style)
│   ├── card.jsx           # Card components
│   ├── button.jsx         # Button component
│   ├── tabs.jsx           # Tabs components
│   ├── input.jsx          # Input component
│   └── badge.jsx          # Badge component
├── data/                   # Mock data for standards
│   ├── pmbok.json         # PMBOK 7th Edition data
│   ├── prince2.json       # PRINCE2 data
│   └── iso.json           # ISO 21500/21502 data
├── pages/                  # Main application pages
│   ├── Repository.jsx     # Standards repository page
│   ├── Comparison.jsx     # Side-by-side comparison page
│   ├── Insights.jsx       # Analytics dashboard
│   └── Bookmarks.jsx      # Saved sections page
├── lib/
│   └── utils.js           # Utility functions (cn helper)
├── App.jsx                # Main application component
├── main.jsx              # React entry point
└── index.css             # Global styles with Tailwind
```

## 🎨 Technology Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS with custom design system
- **UI Components**: Custom shadcn/ui inspired components
- **Icons**: Lucide React
- **State Management**: React useState/useEffect
- **Data Storage**: localStorage for bookmarks

## 📖 Usage Guide

### Repository Page
1. **Browse Standards**: View all sections from PMBOK, PRINCE2, and ISO
2. **Search Content**: Use the search bar to find specific topics or keywords
3. **Filter by Standard**: Click standard buttons to filter content
4. **Expand Sections**: Click "Read More" to view full content
5. **Bookmark Sections**: Click the bookmark icon to save for later

### Comparison Page
1. **Select Topic**: Choose a category to compare (Risk, Stakeholders, etc.)
2. **View Side-by-Side**: See how each standard addresses the topic
3. **Analyze Differences**: Review highlighted keywords and approaches
4. **Navigate to Details**: Use "View in Repository" links for full content

### Insights Dashboard
1. **Overview Statistics**: View summary metrics and coverage
2. **Analyze Similarities**: Explore common themes across standards
3. **Study Differences**: Understand key variations in approaches
4. **Export Analysis**: Download insights as JSON or copy to clipboard

### Bookmarks Page
1. **View Saved Sections**: Access all your bookmarked content
2. **Filter by Category**: Organize bookmarks by topic
3. **Manage Collection**: Remove individual bookmarks or clear all
4. **Quick Access**: Jump to full content in repository

## 🔧 Customization

### Adding New Standards
1. Create a new JSON file in `src/data/`
2. Follow the existing structure:
   ```json
   {
     "standard": "Standard Name",
     "description": "Description",
     "sections": [
       {
         "id": "unique-id",
         "title": "Section Title",
         "category": "category-name",
         "content": "Section content..."
       }
     ]
   }
   ```
3. Import and add to the data arrays in components

### Modifying Categories
Update the `category` field in JSON files and components will automatically adapt.

### Styling Changes
- Edit `tailwind.config.js` for design system changes
- Modify `src/index.css` for global styles
- Update component styles in individual `.jsx` files

## 🌟 Features in Detail

### Search Functionality
- **Real-time search** across all content
- **Highlighting** of matching terms
- **Multi-field search** (title, content, category)
- **Case-insensitive** matching

### Responsive Design
- **Mobile-first** approach
- **Adaptive layouts** for all screen sizes
- **Touch-friendly** interactions
- **Accessible** navigation

### Data Management
- **Client-side storage** for bookmarks
- **JSON-based** content structure
- **Modular data** organization
- **Easy content updates**

### Performance
- **Optimized rendering** with React best practices
- **Efficient filtering** with useMemo hooks
- **Lazy content loading** where appropriate
- **Minimal bundle size** with Vite

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is available under the MIT License.

## 🆘 Support

For questions or issues:
1. Check the documentation above
2. Review the code comments
3. Open an issue on the repository
4. Contact the development team

---

**Built with ❤️ for Project Management Professionals**# PM-Standards-Comparison-Tool-weapp
