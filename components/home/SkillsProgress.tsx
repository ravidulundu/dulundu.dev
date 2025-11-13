'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslations } from 'next-intl';
import { Zap, Gauge, Code2, Database, Palette, Wrench } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { fadeInUp, staggerContainer, progressBar } from '@/lib/animations';

interface Skill {
  name: string;
  level: number; // 0-100
  icon: typeof Code2;
  color: string;
}

export function SkillsProgress() {
  const t = useTranslations('skills');
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const skillCategories = [
    {
      title: t('wordpress.title'),
      icon: Code2,
      skills: [
        { name: 'WordPress', level: 95, icon: Code2, color: 'bg-blue-500' },
        { name: 'WooCommerce', level: 90, icon: Code2, color: 'bg-purple-500' },
        { name: 'PHP', level: 85, icon: Code2, color: 'bg-indigo-500' },
      ],
    },
    {
      title: t('performance.title'),
      icon: Gauge,
      skills: [
        { name: 'Core Web Vitals', level: 95, icon: Gauge, color: 'bg-green-500' },
        { name: 'Caching', level: 90, icon: Zap, color: 'bg-yellow-500' },
        { name: 'CDN Setup', level: 88, icon: Wrench, color: 'bg-orange-500' },
      ],
    },
    {
      title: t('fullstack.title'),
      icon: Zap,
      skills: [
        { name: 'Next.js', level: 92, icon: Code2, color: 'bg-slate-700' },
        { name: 'React', level: 93, icon: Code2, color: 'bg-cyan-500' },
        { name: 'TypeScript', level: 90, icon: Code2, color: 'bg-blue-600' },
        { name: 'PostgreSQL', level: 85, icon: Database, color: 'bg-blue-400' },
        { name: 'Tailwind CSS', level: 95, icon: Palette, color: 'bg-teal-500' },
      ],
    },
  ];

  return (
    <section className="py-20 px-4 md:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
            {t('title')}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-3 gap-8"
        >
          {skillCategories.map((category, categoryIndex) => {
            const CategoryIcon = category.icon;
            return (
              <motion.div key={category.title} variants={fadeInUp}>
                <Card className="h-full hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    {/* Category Header */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <CategoryIcon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold">{category.title}</h3>
                    </div>

                    {/* Skills Progress Bars */}
                    <div className="space-y-5">
                      {category.skills.map((skill, skillIndex) => {
                        const SkillIcon = skill.icon;
                        return (
                          <div key={skill.name} className="space-y-2">
                            {/* Skill Name & Icon */}
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <SkillIcon className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">{skill.name}</span>
                              </div>
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                                transition={{ delay: categoryIndex * 0.2 + skillIndex * 0.1 + 0.5 }}
                                className="text-muted-foreground font-semibold"
                              >
                                {skill.level}%
                              </motion.span>
                            </div>

                            {/* Progress Bar */}
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                variants={progressBar(categoryIndex * 0.2 + skillIndex * 0.1)}
                                initial="hidden"
                                animate={inView ? 'visible' : 'hidden'}
                                className={`h-full ${skill.color} rounded-full`}
                                style={{ width: `${skill.level}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">10+</div>
            <div className="text-sm text-muted-foreground">Technologies</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">50+</div>
            <div className="text-sm text-muted-foreground">Projects</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">5+</div>
            <div className="text-sm text-muted-foreground">Years</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">100%</div>
            <div className="text-sm text-muted-foreground">Satisfaction</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
