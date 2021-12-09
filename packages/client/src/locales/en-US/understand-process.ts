/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export const why = `<p>The goal of ShowWhy is to help you answer cause-and-effect questions of the form “Does X cause Y for Z?”, where X, Y, and Z are the exposure, outcome, and population of interest.</p>
<p>In the <a href="https://plato.stanford.edu/entries/causation-mani/">interventionist definition</a> of causality, we say that an event X causes another event Y if we observe a difference in Y’s value after changing X, <i>keeping everything else constant</i>.</p>					
<p>	The gold standard in keeping everything else constant is the randomized controlled trial. Here the cause X (often called the exposure or treatment) is randomized, so whatever other variables might influence the outcome (Y) are balanced across the “treated” group who are exposed to the hypothesized cause (X) and the “untreated” group who are unexposed.</p>
<p>	However, it isn’t always practical or ethical to run a randomized controlled trial with actual exposures performed or withheld. In these cases, we can perform a retrospective analysis of observational data that have already been collected. By making assumptions about the data-generating process for the observational data, we can estimate the causal effect of an exposure X in two ways: 1) by conditioning on the right variables to ensure that other factors that might influence the outcome are balanced across the treated and untreated groups; 2) viewing the data as the result of a natural experiment in which nature or other factors arbitrarily determine which individuals are exposed and which are not.</p>	
<p>	In other words, ShowWhy enables emulation of randomized controlled trials that produce a high standard of real-world evidence.</p>`

export const who = `
<p>The process used to obtain causal effect estimates from observational data is called causal inference. ShowWhy aims to help domain experts develop real-world evidence in an interactive and guided way that assumes no prior expertise in either causal inference or data science.​</p>
<p>This kind of “democratization” of data activities has already been successful in the area of Business Intelligence, enabling users who are not data scientists to view, explore, and make sense of data for the first time. By allowing users to “drill down” into datasets based on the joint distributions of data attributes, these tools can help them to see patterns of association that would otherwise remain hidden.​</p>
<p>However, such associations only show correlation, not causation. Treating the resulting observations as insights into how some attributes are “driving” or “influencing” others could be a mistake, and lead to ineffective (or even harmful) decisions about what actions to take in response.​</p>
<p>Tools for causal inference exist, but they are only accessible by skilled data scientists, and only produce valid results under the correct modelling of domain knowledge. ShowWhy only assumes the domain knowledge and otherwise guides the user through the end-to-end process of data preparation, causal inference, and defending the validity of the resulting estimates of effect size.​</p>`

export const when = `<p>ShowWhy is not a tool for causal discovery – detecting potential causal relationships consistent with a given dataset. As the user, you should already have a strong understanding of the causal relationships operating in the domain of the data before using the tool.​</p>
<p>Similarly, ShowWhy is not a tool for exploratory analysis of many candidate causal relationships. Rather, ShowWhy uses causal inference to perform confirmatory analysis of a single causal question over a given dataset. As the user, you should already have a sense of the question you would like to ask before using the tool.​</p>
<p>You can enter your causal question in the header above and are encouraged to do so as soon as you are ready. You are also free to refine it throughout the process of preparing your data, modelling the domain, and planning the analysis. You need to input your final question before executing the analysis, however, and the question should not be modified beyond that point.​</p>`

export const how = `<p>ShowWhy follows best practices in real-world evidence development pioneered in the medical domain. By emulating the process of designing and performing a randomized control trial, as described in <a href="https://www.frontiersin.org/articles/10.3389/fphar.2021.700776/full">“Ten Rules for Conducting Retrospective Pharmacoepidemiological Analyses: Example COVID-19 Study”</a>, ShowWhy guides the user through the rigorous process of obtaining the highest quality evidence that can be derived from observational data.​</p>
<p>Behind the scenes, ShowWhy generates auditable reports of the causal inference process, including Python notebooks using the causal inference libraries DoWhy and EconML. These can be independently reviewed and validated by causal inference experts as needed or used by data scientists to learn causal inference grounded in real data and questions.</p>
<p>Please note that the current version of ShowWhy only supports causal inference with <i>binary</i> exposures using <a href="https://causalinference.gitlab.io/kdd-tutorial/methods.html">conditioning-based methods</a>. We plan to provide support for categorical and continuous exposures in future releases.</p>`

export const whyLinks = [
	{
		title: 'Randomized vs Observational Causal Inference',
		links: [
			{
				title: 'Video',
				description: 'Key features of a randomized controlled trial',
				image: '',
				url: 'https://www.youtube.com/watch?v=Wy7qpJeozec',
			},
			{
				title: 'Video',
				description: 'Confounding variables in observational studies',
				image: '',
				url: 'https://www.youtube.com/watch?v=fjdb4ID7HVg',
			},
			{
				title: 'Slides',
				description: 'Conditioning-based methods vs natural experiments',
				image: '',
				url: 'https://causalinference.gitlab.io/kdd-tutorial/methods.html',
			},
		],
	},
	{
		title: 'Real World Data & Evidence​',
		links: [
			{
				title: 'Video',
				description: 'What is Real World Data, Real World Evidence?',
				image: '',
				url: 'https://www.youtube.com/watch?v=7KX5w_TFNYo',
			},
			{
				title: 'Slides',
				description:
					'Causal inference for real-world evidence: Propensity score methods and case study',
				image: '',
				url: 'https://ww2.amstat.org/meetings/biop/2020/onlineprogram/handouts/SC4-Handouts.pdf',
			},
			{
				title: 'Research article',
				description:
					'Case study: Causal impact of masks, policies, behavior on early COVID-19 pandemic in the U.S.',
				image: '',
				url: 'https://www.sciencedirect.com/science/article/pii/S0304407620303468',
			},
		],
	},
]

export const whoLinks = [
	{
		title: 'Correlation vs Causation',
		links: [
			{
				title: 'Video',
				description: 'The danger of mixing up causality and correlation',
				image: '',
				url: 'https://www.youtube.com/watch?v=8B271L3NtAw',
			},
			{
				title: 'Video',
				description: 'Simpson’s Paradox: How statistics can be misleading',
				image: '',
				url: 'https://www.youtube.com/watch?v=ebEkn-BiW5k',
			},
			{
				title: 'Video',
				description:
					'How causal models allow us to infer causation from correlation',
				image: '',
				url: 'https://www.youtube.com/watch?v=HUti6vGctQM',
			},
		],
	},
	{
		title: 'Causal Inference vs Machine Learning ',
		links: [
			{
				title: 'Video',
				description:
					'The seven tools of causal inference, with reflections on machine learning',
				image: '',
				url: 'https://www.youtube.com/watch?v=CsMV5o3hotY',
			},
			{
				title: 'Video',
				description:
					'Foundations of causal inference and its impacts on machine learning',
				image: '',
				url: 'https://www.youtube.com/watch?v=LALfQStONEc',
			},
			{
				title: 'Video',
				description:
					'Causal inference in data science: From prediction to causation',
				image: '',
				url: 'https://www.youtube.com/watch?v=6SCoaBo1MqU',
			},
		],
	},
]

export const whenLinks = [
	{
		title: 'Causal discovery vs Inference',
		links: [
			{
				title: 'Video',
				description:
					'Introduction to causal network discovery from biomedical and clinical data',
				image: '',
				url: 'https://www.youtube.com/watch?v=kixvWwCeUAY',
			},
			{
				title: 'Research article',
				description:
					'Review of causal discovery methods based on graphical models ',
				image: '',
				url: 'https://www.frontiersin.org/articles/10.3389/fgene.2019.00524/full',
			},
		],
	},
	{
		title: 'Exploratory vs Confirmative analysis',
		links: [
			{
				title: 'Video',
				description:
					'5 minutes statistics for clinical research: Exploratory and confirmative analysis',
				image: '',
				url: 'https://www.youtube.com/watch?v=ca3bDHg0l7k',
			},
			{
				title: 'Research article',
				description: 'Statistical analysis plan for observational studies',
				image: '',
				url: 'https://bmcmedresmethodol.biomedcentral.com/articles/10.1186/s12874-019-0879-5',
			},
		],
	},
]

export const howLinks = [
	{
		title: 'Related Research',
		links: [
			{
				title: 'Research article',
				description:
					'Ten rules for conducting retrospective pharmacoepidemiological analyses: Example COVID-19 study',
				image: '',
				url: 'https://www.frontiersin.org/articles/10.3389/fphar.2021.700776/full',
			},
			{
				title: 'Research article',
				description:
					'Specification curve analysis:  Descriptive and inferential statistics on all reasonable specifications',
				image: '',
				url: 'https://urisohn.com/sohn_files/wp/wordpress/wp-content/uploads/Paper-Specification-curve-2018-11-02.pdf',
			},
			{
				title: 'Research article',
				description:
					'DoWhy: Addressing challenges in expressing and validating causal assumptions',
				image: '',
				url: 'https://arxiv.org/pdf/2108.13518.pdf',
			},
		],
	},
	{
		title: 'Related Tools',
		links: [
			{
				title: 'Documentation',
				description:
					'DoWhy: An end-to-end library for causal inference (Microsoft Research)',
				image: '',
				url: 'https://microsoft.github.io/dowhy/',
			},
			{
				title: 'Documentation',
				description:
					'EconML: Machine learning-based estimation of heterogeneous treatment effects (Microsoft Research)',
				image: '',
				url: 'https://econml.azurewebsites.net/index.html',
			},
			{
				title: 'Documentation',
				description:
					'CausalML: Uplifting modeling and causal inference methods using machine learning algorithms (Uber)',
				image: '',
				url: 'https://causalml.readthedocs.io/en/latest/about.html',
			},
		],
	},
]
