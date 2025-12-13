# Contributing to DevAgent Pro

Thank you for your interest in contributing to DevAgent Pro! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn and grow

## How to Contribute

### Reporting Bugs

1. Check if bug already exists in [Issues](https://github.com/not-noobcoder99/Dev-Agent-/issues)
2. Create new issue with:
   - Clear title
   - Steps to reproduce
   - Expected vs actual behavior
   - System information
   - Screenshots if applicable

### Suggesting Features

1. Check existing feature requests
2. Create issue with:
   - Clear description
   - Use case
   - Proposed implementation
   - Benefits

### Pull Requests

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Make changes
4. Test thoroughly
5. Commit: `git commit -m "Add your feature"`
6. Push: `git push origin feature/your-feature`
7. Open Pull Request

### Code Style

**TypeScript/JavaScript**:
- Use TypeScript
- Follow ESLint rules
- Use meaningful variable names
- Add JSDoc comments

**Python**:
- Follow PEP 8
- Use type hints
- Add docstrings
- Use meaningful names

**General**:
- Write clear commit messages
- Keep functions small and focused
- Add tests for new features
- Update documentation

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/Dev-Agent-.git

# Add upstream remote
git remote add upstream https://github.com/not-noobcoder99/Dev-Agent-.git

# Install dependencies
npm install
cd frontend && npm install && cd ..
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Add your API keys

# Start development
npm run dev
```

## Testing

```bash
# Test code generation
npm run agent:generate -- "Test prompt" typescript

# Test review
npm run agent:review

# Test evaluation
python eval/oumi_eval.py ./generated

# Test frontend
cd frontend && npm run dev
```

## Documentation

- Update README.md for user-facing changes
- Update DOCUMENTATION.md for technical changes
- Add inline comments for complex logic
- Update JSDoc/docstrings

## Commit Messages

Format: `type(scope): message`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

Examples:
```
feat(agent): add Python code generation
fix(review): handle empty file lists
docs(readme): update installation steps
```

## Release Process

1. Update version in package.json
2. Update CHANGELOG.md
3. Create release branch
4. Test thoroughly
5. Merge to main
6. Tag release
7. Deploy to production

## Questions?

- Open a discussion on GitHub
- Check existing issues
- Contact maintainers

Thank you for contributing! 🚀
