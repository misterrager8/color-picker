from . import db


class Theme(db.Model):
    __tablename__ = "themes"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    hex = db.Column(db.Text)
    text_color = db.Column(db.Text)

    def __init__(self, **kwargs):
        super(Theme, self).__init__(**kwargs)

    @classmethod
    def get(cls, id):
        return Theme.query.get(id)

    @classmethod
    def all(cls):
        return sorted([i for i in Theme.query.all()], key=lambda x: x.id, reverse=True)

    @classmethod
    def delete_all(cls):
        for i in Theme.all():
            db.session.delete(i)

        db.session.commit()

    def add(self):
        db.session.add(self)
        db.session.commit()

    def edit(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def to_dict(self):
        return {
            "name": self.name,
            "id": self.id,
            "hex": self.hex,
            "textColor": self.text_color,
        }
