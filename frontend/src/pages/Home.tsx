import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Settings, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
            Вашият доверен партньор за <span className="text-primary">сервиз на уреди</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Професионален ремонт, монтаж и поддръжка на бяла техника. Бързо, качествено и с гаранция.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/request">
                Заяви сервиз <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Свържете се с нас</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Бърза реакция</h3>
              <p className="text-slate-600">Посещение на място в най-кратки срокове след вашата заявка.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                <Settings className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Оригинални части</h3>
              <p className="text-slate-600">Работим само с проверени доставчици и оригинални резервни части.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Гаранция</h3>
              <p className="text-slate-600">Предоставяме официална гаранция за всеки извършен ремонт.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Нашите услуги</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Предлагаме широк спектър от професионални услуги за вашата бяла техника.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Перални и сушилни', desc: 'Ремонт на всички марки и модели перални и сушилни машини.' },
              { title: 'Съдомиялни', desc: 'Професионална диагностика и ремонт на съдомиялни машини.' },
              { title: 'Хладилници', desc: 'Ремонт на хладилници, фризери и комбинирани уреди.' },
              { title: 'Готварски печки', desc: 'Поправка на фурни, плотове и готварски печки на ток.' },
            ].map((service) => (
              <div key={service.title} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h4 className="font-bold mb-2">{service.title}</h4>
                <p className="text-sm text-slate-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Как работи?</h2>
            <p className="text-slate-600">Процесът от заявката до работещия уред е максимално улеснен.</p>
          </div>
          <div className="flex flex-col md:flex-row justify-between gap-8">
            {[
              { step: '01', title: 'Онлайн заявка', desc: 'Попълвате краткия формуляр на нашия сайт.' },
              { step: '02', title: 'Потвърждение', desc: 'Наш служител се свързва с вас за уговаряне на час.' },
              { step: '03', title: 'Посещение', desc: 'Техник посещава адреса и извършва диагностика.' },
              { step: '04', title: 'Ремонт', desc: 'Отстраняваме повредата и тестваме уреда.' },
            ].map((item) => (
              <div key={item.step} className="flex-1 relative">
                <div className="text-5xl font-black text-slate-100 mb-4">{item.step}</div>
                <h4 className="font-bold mb-2">{item.title}</h4>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Вашият уред има нужда от ремонт?</h2>
          <p className="text-xl mb-10 opacity-90">Не отлагайте! Изпратете вашата заявка още сега.</p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/request">Заяви ремонт сега</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
