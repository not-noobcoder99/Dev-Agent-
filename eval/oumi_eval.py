"""
Oumi Evaluation Module for DevAgent Pro

This module evaluates the quality of generated code using Oumi's AI evaluation framework.
It provides metrics for code quality, relevance, and best practices adherence.
"""

import os
import json
import requests
from typing import Dict, List, Any, Optional
from datetime import datetime
from pathlib import Path


class OumiEvaluator:
    """
    Evaluator for code quality using Oumi AI
    """
    
    def __init__(self, api_key: Optional[str] = None, api_url: Optional[str] = None):
        self.api_key = api_key or os.getenv('OUMI_API_KEY', '')
        self.api_url = api_url or os.getenv('OUMI_API_URL', 'https://api.oumi.ai')
        self.use_mock = not self.api_key or len(self.api_key) < 10
        
        if self.use_mock:
            print('⚠️  OUMI_API_KEY not found. Using mock evaluation mode.')
    
    def evaluate(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Evaluate code quality based on context
        
        Args:
            context: Dictionary containing:
                - code_files: Path to generated code directory
                - review_score: Score from code review (0-100)
                - issues: List of issues found in review
                
        Returns:
            Evaluation result with scores and recommendations
        """
        print('🔍 Starting Oumi evaluation...')
        
        try:
            # Read code files
            code_files = self._read_code_files(context.get('code_files', './generated'))
            
            # Get review context
            review_score = context.get('review_score', 0)
            issues = context.get('issues', [])
            
            # Perform evaluation
            if self.use_mock:
                result = self._mock_evaluate(code_files, review_score, issues)
            else:
                result = self._ai_evaluate(code_files, review_score, issues)
            
            print(f'✅ Evaluation complete! Overall score: {result["overall_score"]}/100')
            
            return result
            
        except Exception as e:
            print(f'❌ Evaluation failed: {e}')
            return {
                'success': False,
                'error': str(e),
                'overall_score': 0,
                'timestamp': datetime.now().isoformat()
            }
    
    def _read_code_files(self, directory: str) -> List[Dict[str, str]]:
        """Read all code files from directory"""
        files = []
        code_extensions = ['.ts', '.js', '.py', '.java', '.go', '.rs']
        
        dir_path = Path(directory)
        if not dir_path.exists():
            print(f'⚠️  Directory not found: {directory}')
            return files
        
        for file_path in dir_path.rglob('*'):
            if file_path.is_file() and file_path.suffix in code_extensions:
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        files.append({
                            'path': str(file_path),
                            'name': file_path.name,
                            'content': content,
                            'language': self._detect_language(file_path.suffix)
                        })
                except Exception as e:
                    print(f'⚠️  Failed to read {file_path}: {e}')
        
        print(f'📁 Read {len(files)} code files')
        return files
    
    def _detect_language(self, extension: str) -> str:
        """Detect language from file extension"""
        lang_map = {
            '.ts': 'typescript',
            '.js': 'javascript',
            '.py': 'python',
            '.java': 'java',
            '.go': 'go',
            '.rs': 'rust'
        }
        return lang_map.get(extension.lower(), 'unknown')
    
    def _ai_evaluate(self, code_files: List[Dict], review_score: float, issues: List) -> Dict:
        """Evaluate using Oumi AI API"""
        try:
            # Prepare evaluation request
            payload = {
                'task': 'code_quality_evaluation',
                'code_files': [
                    {
                        'name': f['name'],
                        'content': f['content'][:2000],  # Limit content size
                        'language': f['language']
                    }
                    for f in code_files[:5]  # Limit to 5 files
                ],
                'context': {
                    'review_score': review_score,
                    'issue_count': len(issues),
                    'critical_issues': len([i for i in issues if i.get('severity') == 'critical'])
                },
                'metrics': [
                    'code_quality',
                    'maintainability',
                    'security',
                    'performance',
                    'best_practices'
                ]
            }
            
            # Call Oumi API
            response = requests.post(
                f'{self.api_url}/evaluate',
                headers={
                    'Authorization': f'Bearer {self.api_key}',
                    'Content-Type': 'application/json'
                },
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                return self._format_result(data, code_files, review_score)
            else:
                print(f'⚠️  API error: {response.status_code}')
                return self._mock_evaluate(code_files, review_score, issues)
                
        except Exception as e:
            print(f'⚠️  AI evaluation failed: {e}')
            return self._mock_evaluate(code_files, review_score, issues)
    
    def _mock_evaluate(self, code_files: List[Dict], review_score: float, issues: List) -> Dict:
        """Mock evaluation for testing without API"""
        print('🎭 Using mock evaluation')
        
        # Calculate mock scores based on available data
        total_lines = sum(len(f['content'].split('\n')) for f in code_files)
        avg_file_size = total_lines / max(len(code_files), 1)
        
        # Scoring logic
        quality_score = max(0, review_score - len(issues) * 2)
        
        maintainability_score = 85
        if avg_file_size > 500:
            maintainability_score -= 10
        if len(code_files) > 10:
            maintainability_score -= 5
        
        security_score = 90
        critical_issues = len([i for i in issues if i.get('severity') == 'critical'])
        security_score -= critical_issues * 15
        
        performance_score = 80
        best_practices_score = review_score * 0.9
        
        overall_score = (
            quality_score * 0.3 +
            maintainability_score * 0.2 +
            security_score * 0.2 +
            performance_score * 0.15 +
            best_practices_score * 0.15
        )
        
        return {
            'success': True,
            'overall_score': round(overall_score, 2),
            'metrics': {
                'code_quality': round(quality_score, 2),
                'maintainability': round(maintainability_score, 2),
                'security': round(security_score, 2),
                'performance': round(performance_score, 2),
                'best_practices': round(best_practices_score, 2)
            },
            'analysis': {
                'total_files': len(code_files),
                'total_lines': total_lines,
                'avg_file_size': round(avg_file_size, 2),
                'languages': list(set(f['language'] for f in code_files))
            },
            'recommendations': self._generate_recommendations(
                overall_score, quality_score, security_score, issues
            ),
            'timestamp': datetime.now().isoformat()
        }
    
    def _format_result(self, api_response: Dict, code_files: List[Dict], review_score: float) -> Dict:
        """Format API response into standard result"""
        return {
            'success': True,
            'overall_score': api_response.get('overall_score', 0),
            'metrics': api_response.get('metrics', {}),
            'analysis': {
                'total_files': len(code_files),
                'review_score': review_score,
                **api_response.get('analysis', {})
            },
            'recommendations': api_response.get('recommendations', []),
            'timestamp': datetime.now().isoformat()
        }
    
    def _generate_recommendations(
        self, 
        overall_score: float, 
        quality_score: float, 
        security_score: float,
        issues: List
    ) -> List[str]:
        """Generate recommendations based on scores"""
        recommendations = []
        
        if overall_score < 70:
            recommendations.append('Overall code quality needs improvement')
        
        if quality_score < 60:
            recommendations.append('Address code quality issues found in review')
        
        if security_score < 70:
            recommendations.append('Critical: Fix security vulnerabilities')
        
        critical_issues = [i for i in issues if i.get('severity') == 'critical']
        if critical_issues:
            recommendations.append(f'Fix {len(critical_issues)} critical issues immediately')
        
        if overall_score >= 80:
            recommendations.append('Code quality is good! Minor improvements suggested')
        
        if not recommendations:
            recommendations.append('Excellent code quality! Ready for deployment')
        
        return recommendations
    
    def generate_report(self, result: Dict) -> str:
        """Generate human-readable evaluation report"""
        report = '\n' + '=' * 60 + '\n'
        report += '📊 OUMI EVALUATION REPORT\n'
        report += '=' * 60 + '\n\n'
        
        if not result.get('success', False):
            report += f'❌ Evaluation failed: {result.get("error", "Unknown error")}\n'
            return report
        
        report += f'🎯 Overall Score: {result["overall_score"]}/100\n\n'
        
        report += '📈 Detailed Metrics:\n'
        metrics = result.get('metrics', {})
        for metric, score in metrics.items():
            icon = '🟢' if score >= 80 else '🟡' if score >= 60 else '🔴'
            report += f'  {icon} {metric.replace("_", " ").title()}: {score}/100\n'
        
        report += '\n📊 Analysis:\n'
        analysis = result.get('analysis', {})
        for key, value in analysis.items():
            report += f'  • {key.replace("_", " ").title()}: {value}\n'
        
        report += '\n💡 Recommendations:\n'
        recommendations = result.get('recommendations', [])
        for i, rec in enumerate(recommendations, 1):
            report += f'  {i}. {rec}\n'
        
        report += '\n' + '=' * 60 + '\n'
        
        return report


def main():
    """CLI interface for evaluation"""
    import sys
    
    if len(sys.argv) < 2:
        print('''
🔍 DevAgent Pro - Oumi Evaluator

Usage:
  python eval/oumi_eval.py <code_directory> [review_score]

Example:
  python eval/oumi_eval.py ./generated 85

Arguments:
  code_directory  - Path to generated code
  review_score    - Optional review score (0-100)
        ''')
        sys.exit(1)
    
    code_dir = sys.argv[1]
    review_score = float(sys.argv[2]) if len(sys.argv) > 2 else 75
    
    # Load review results if available
    issues = []
    review_file = Path(code_dir) / 'review-result.json'
    if review_file.exists():
        with open(review_file, 'r') as f:
            review_data = json.load(f)
            issues = review_data.get('issues', [])
            review_score = review_data.get('score', review_score)
    
    # Run evaluation
    evaluator = OumiEvaluator()
    result = evaluator.evaluate({
        'code_files': code_dir,
        'review_score': review_score,
        'issues': issues
    })
    
    # Display report
    print(evaluator.generate_report(result))
    
    # Save result
    output_file = Path(code_dir) / 'eval-result.json'
    with open(output_file, 'w') as f:
        json.dump(result, f, indent=2)
    print(f'\n📄 Result saved to: {output_file}')


if __name__ == '__main__':
    main()
