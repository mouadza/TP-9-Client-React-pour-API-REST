import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

function CompteList() {
  const [comptes, setComptes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ solde: '', dateCreation: '', type: 'COURANT' });
  const [loading, setLoading] = useState(false);

  const fetchComptes = () => {
    axios.get(`${API_BASE_URL}comptes`)
      .then(res => setComptes(res.data))
      .catch(err => console.error('GET /comptes failed:', err?.response?.data || err.message));
  };

  useEffect(() => {
    fetchComptes();
  }, []);

  const startEdit = (compte) => {
    setEditingId(compte.id);
    setEditForm({
      solde: compte.solde ?? '',
      // ensure YYYY-MM-DD for a <input type="date">
      dateCreation: (compte.dateCreation || '').toString().slice(0, 10),
      type: compte.type || 'COURANT'
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ solde: '', dateCreation: '', type: 'COURANT' });
  };

  const onEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const saveEdit = async (id) => {
    try {
      setLoading(true);
      await axios.put(`${API_BASE_URL}comptes/${id}`, editForm);
      cancelEdit();
      fetchComptes();
      alert('Compte mis à jour');
    } catch (err) {
      console.error('PUT /comptes/{id} failed:', err?.response?.data || err.message);
      alert("Erreur lors de la mise à jour du compte");
    } finally {
      setLoading(false);
    }
  };

  const deleteCompte = async (id) => {
    const ok = window.confirm('Supprimer ce compte ?');
    if (!ok) return;
    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}comptes/${id}`);
      // remove locally or refetch
      setComptes(prev => prev.filter(c => c.id !== id));
      alert('Compte supprimé');
    } catch (err) {
      console.error('DELETE /comptes/{id} failed:', err?.response?.data || err.message);
      alert("Erreur lors de la suppression du compte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center gap-3">
        <h2 className="mb-0">Liste des Comptes</h2>
        {loading && <span className="badge bg-secondary">Traitement...</span>}
      </div>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Solde</th>
            <th>Date de Création</th>
            <th>Type</th>
            <th style={{ width: 200 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {comptes.map((compte) => {
            const isEditing = editingId === compte.id;
            return (
              <tr key={compte.id}>
                <td>{compte.id}</td>

                {/* Solde */}
                <td>
                  {isEditing ? (
                    <input
                      type="number"
                      name="solde"
                      className="form-control"
                      value={editForm.solde}
                      onChange={onEditChange}
                      required
                    />
                  ) : (
                    compte.solde
                  )}
                </td>

                {/* Date de création */}
                <td>
                  {isEditing ? (
                    <input
                      type="date"
                      name="dateCreation"
                      className="form-control"
                      value={editForm.dateCreation}
                      onChange={onEditChange}
                      required
                    />
                  ) : (
                    // show as YYYY-MM-DD (or whatever backend returns)
                    (compte.dateCreation || '').toString().slice(0, 10)
                  )}
                </td>

                {/* Type */}
                <td>
                  {isEditing ? (
                    <select
                      name="type"
                      className="form-select"
                      value={editForm.type}
                      onChange={onEditChange}
                      required
                    >
                      <option value="COURANT">Courant</option>
                      <option value="EPARGNE">Épargne</option>
                    </select>
                  ) : (
                    compte.type
                  )}
                </td>

                {/* Actions */}
                <td>
                  {isEditing ? (
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => saveEdit(compte.id)}
                        disabled={loading}
                      >
                        Enregistrer
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={cancelEdit}
                        disabled={loading}
                      >
                        Annuler
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => startEdit(compte)}
                        disabled={loading}
                      >
                        Modifier
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => deleteCompte(compte.id)}
                        disabled={loading}
                      >
                        Supprimer
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}

          {comptes.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                Aucun compte
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CompteList;
