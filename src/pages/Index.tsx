import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

function Index() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navigation = [
    { id: 'home', label: 'Главная' },
    { id: 'services', label: 'Услуги' },
    { id: 'masters', label: 'Мастера' },
    { id: 'price', label: 'Прайс-лист' },
    { id: 'gallery', label: 'Галерея' },
    { id: 'reviews', label: 'Отзывы' },
    { id: 'booking', label: 'Онлайн-запись' },
    { id: 'contacts', label: 'Контакты' },
  ];

  const services = [
    { icon: 'Scissors', title: 'Стрижки', description: 'Женские, мужские и детские стрижки от профессиональных мастеров' },
    { icon: 'Sparkles', title: 'Окрашивание', description: 'Все виды окрашивания: тонирование, мелирование, омбре' },
    { icon: 'Hand', title: 'Маникюр', description: 'Классический и аппаратный маникюр с покрытием' },
    { icon: 'Smile', title: 'Косметология', description: 'Уходовые процедуры для лица и тела' },
    { icon: 'Wand2', title: 'Брови и ресницы', description: 'Оформление бровей, ламинирование ресниц' },
    { icon: 'User', title: 'Массаж', description: 'Расслабляющий и оздоровительный массаж' },
  ];

  const masters = [
    { name: 'Анна Петрова', specialty: 'Стилист-колорист', experience: '8 лет опыта' },
    { name: 'Мария Иванова', specialty: 'Мастер маникюра', experience: '5 лет опыта' },
    { name: 'Елена Сидорова', specialty: 'Косметолог', experience: '10 лет опыта' },
    { name: 'Ольга Морозова', specialty: 'Массажист', experience: '7 лет опыта' },
  ];

  const priceList = [
    { category: 'Стрижки', items: [
      { name: 'Женская стрижка', price: '1500-2500 ₽' },
      { name: 'Мужская стрижка', price: '800-1200 ₽' },
      { name: 'Детская стрижка', price: '600-900 ₽' },
    ]},
    { category: 'Окрашивание', items: [
      { name: 'Окрашивание корней', price: '2000-3000 ₽' },
      { name: 'Полное окрашивание', price: '3500-5500 ₽' },
      { name: 'Мелирование', price: '4000-6000 ₽' },
    ]},
    { category: 'Маникюр', items: [
      { name: 'Классический маникюр', price: '1200 ₽' },
      { name: 'Маникюр с покрытием', price: '1800 ₽' },
      { name: 'Наращивание ногтей', price: '2500 ₽' },
    ]},
  ];

  const reviews = [
    { author: 'Екатерина', text: 'Прекрасный салон! Мастера настоящие профессионалы. Хожу сюда уже год и всегда довольна результатом.', rating: 5 },
    { author: 'Наталья', text: 'Очень уютная атмосфера и внимательное отношение. Маникюр держится 3 недели без сколов!', rating: 5 },
    { author: 'Ирина', text: 'Делала окрашивание у Анны - результат превзошел ожидания! Волосы живые и блестящие.', rating: 5 },
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsMenuOpen(false);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary/30">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-20">
            <div className="flex items-center gap-2">
              <Icon name="Sparkles" className="text-primary" size={32} />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Сакура
              </span>
            </div>

            <div className="hidden md:flex items-center gap-6">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    activeSection === item.id ? 'text-primary' : 'text-foreground/70'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Icon name="Menu" size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] bg-white">
                <div className="flex flex-col gap-4 mt-8">
                  {navigation.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`text-left px-4 py-3 rounded-lg transition-all ${
                        activeSection === item.id 
                          ? 'bg-primary text-primary-foreground font-medium' 
                          : 'hover:bg-secondary'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </nav>
        </div>
      </header>

      <main>
        <section id="home" className="py-20 md:py-32 animate-fade-in">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Салон красоты <span className="text-primary">Сакура</span>
                </h1>
                <p className="text-lg text-muted-foreground">
                  Профессиональный уход и забота о вашей красоте. 
                  Создаём неповторимые образы с 2015 года.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="lg" className="gap-2">
                        <Icon name="Calendar" size={20} />
                        Записаться онлайн
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Онлайн-запись</DialogTitle>
                      </DialogHeader>
                      <BookingForm />
                    </DialogContent>
                  </Dialog>
                  <Button size="lg" variant="outline" onClick={() => scrollToSection('services')}>
                    Наши услуги
                  </Button>
                </div>
              </div>
              <div className="relative">
                <img 
                  src="https://cdn.poehali.dev/projects/6539fc2e-f599-4477-a7fb-07cda6cdddd8/files/c6c3bb46-c353-4c73-83c8-f07c4bf06271.jpg"
                  alt="Салон красоты Сакура"
                  className="rounded-3xl shadow-2xl w-full h-[400px] object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Наши услуги</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Полный спектр услуг для вашей красоты и здоровья
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon name={service.icon} className="text-primary" size={28} />
                    </div>
                    <h3 className="text-xl font-semibold">{service.title}</h3>
                    <p className="text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="masters" className="py-20 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Наши мастера</h2>
              <p className="text-lg text-muted-foreground">
                Команда профессионалов с многолетним опытом
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {masters.map((master, index) => (
                <Card key={index} className="text-center hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent mx-auto flex items-center justify-center text-4xl">
                      👩‍💼
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{master.name}</h3>
                      <p className="text-primary font-medium">{master.specialty}</p>
                      <p className="text-sm text-muted-foreground mt-2">{master.experience}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="price" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Прайс-лист</h2>
              <p className="text-lg text-muted-foreground">
                Наши цены на популярные услуги
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {priceList.map((category, index) => (
                <Card key={index} className="border-2">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold mb-6 text-primary">{category.category}</h3>
                    <div className="space-y-4">
                      {category.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-start gap-4">
                          <span className="text-sm">{item.name}</span>
                          <span className="font-semibold whitespace-nowrap text-primary">{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="gallery" className="py-20 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Галерея работ</h2>
              <p className="text-lg text-muted-foreground">
                Результаты работы наших мастеров
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="aspect-square bg-gradient-to-br from-primary/20 to-accent/30 rounded-xl hover:scale-105 transition-transform shadow-lg"></div>
              ))}
            </div>
          </div>
        </section>

        <section id="reviews" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Отзывы клиентов</h2>
              <p className="text-lg text-muted-foreground">
                Что говорят о нас наши гости
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {reviews.map((review, index) => (
                <Card key={index} className="border-2">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Icon key={i} name="Star" className="text-primary fill-primary" size={20} />
                      ))}
                    </div>
                    <p className="text-muted-foreground italic">"{review.text}"</p>
                    <p className="font-semibold text-primary">— {review.author}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="booking" className="py-20 bg-gradient-to-br from-primary/10 to-accent/20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Запись онлайн</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Выберите удобное время и запишитесь на процедуру прямо сейчас
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" className="gap-2">
                    <Icon name="Calendar" size={20} />
                    Записаться на услугу
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Онлайн-запись</DialogTitle>
                  </DialogHeader>
                  <BookingForm />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </section>

        <section id="contacts" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Контакты</h2>
              <p className="text-lg text-muted-foreground">
                Мы всегда рады вас видеть
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon name="MapPin" className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Адрес</h3>
                    <p className="text-muted-foreground">г. Москва, ул. Примерная, д. 123</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon name="Phone" className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Телефон</h3>
                    <p className="text-muted-foreground">+7 (495) 123-45-67</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon name="Clock" className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Время работы</h3>
                    <p className="text-muted-foreground">Ежедневно с 9:00 до 21:00</p>
                  </div>
                </div>
              </div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Обратная связь</h3>
                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div>
                      <Label htmlFor="contact-name">Имя</Label>
                      <Input id="contact-name" placeholder="Ваше имя" />
                    </div>
                    <div>
                      <Label htmlFor="contact-phone">Телефон</Label>
                      <Input id="contact-phone" placeholder="+7 (___) ___-__-__" />
                    </div>
                    <div>
                      <Label htmlFor="contact-message">Сообщение</Label>
                      <Textarea id="contact-message" placeholder="Ваше сообщение" rows={4} />
                    </div>
                    <Button className="w-full">Отправить</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-foreground/5 py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Icon name="Sparkles" className="text-primary" size={28} />
              <span className="text-xl font-bold">Сакура</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2024 Салон красоты Сакура. Все права защищены.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Icon name="Instagram" size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Icon name="Facebook" size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Icon name="MessageCircle" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function BookingForm() {
  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div>
        <Label htmlFor="name">Имя</Label>
        <Input id="name" placeholder="Ваше имя" required />
      </div>
      <div>
        <Label htmlFor="phone">Телефон</Label>
        <Input id="phone" placeholder="+7 (___) ___-__-__" required />
      </div>
      <div>
        <Label htmlFor="service">Услуга</Label>
        <Select>
          <SelectTrigger id="service">
            <SelectValue placeholder="Выберите услугу" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="haircut">Стрижка</SelectItem>
            <SelectItem value="coloring">Окрашивание</SelectItem>
            <SelectItem value="manicure">Маникюр</SelectItem>
            <SelectItem value="cosmetology">Косметология</SelectItem>
            <SelectItem value="brows">Брови и ресницы</SelectItem>
            <SelectItem value="massage">Массаж</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="master">Мастер</Label>
        <Select>
          <SelectTrigger id="master">
            <SelectValue placeholder="Выберите мастера" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="anna">Анна Петрова</SelectItem>
            <SelectItem value="maria">Мария Иванова</SelectItem>
            <SelectItem value="elena">Елена Сидорова</SelectItem>
            <SelectItem value="olga">Ольга Морозова</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="date">Дата</Label>
        <Input id="date" type="date" required />
      </div>
      <div>
        <Label htmlFor="time">Время</Label>
        <Select>
          <SelectTrigger id="time">
            <SelectValue placeholder="Выберите время" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="09:00">09:00</SelectItem>
            <SelectItem value="10:00">10:00</SelectItem>
            <SelectItem value="11:00">11:00</SelectItem>
            <SelectItem value="12:00">12:00</SelectItem>
            <SelectItem value="13:00">13:00</SelectItem>
            <SelectItem value="14:00">14:00</SelectItem>
            <SelectItem value="15:00">15:00</SelectItem>
            <SelectItem value="16:00">16:00</SelectItem>
            <SelectItem value="17:00">17:00</SelectItem>
            <SelectItem value="18:00">18:00</SelectItem>
            <SelectItem value="19:00">19:00</SelectItem>
            <SelectItem value="20:00">20:00</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full gap-2">
        <Icon name="Check" size={20} />
        Подтвердить запись
      </Button>
    </form>
  );
}

export default Index;